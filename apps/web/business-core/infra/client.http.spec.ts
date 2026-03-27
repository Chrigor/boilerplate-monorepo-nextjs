import { faker } from '@faker-js/faker'
import { HttpClient, type HttpError } from './client.http'

const BASE_URL = 'http://api.example.com'

function makeFetchResponse(options: {
  ok?: boolean
  status?: number
  statusText?: string
  body?: unknown
  contentType?: string
}): Response {
  const {
    ok = true,
    status = 200,
    statusText = 'OK',
    body = null,
    contentType = 'application/json',
  } = options

  return {
    ok,
    status,
    statusText,
    headers: { get: (key: string) => (key === 'content-type' ? contentType : null) },
    text: async () => (body !== null ? JSON.stringify(body) : ''),
  } as unknown as Response
}

describe('HttpClient', () => {
  let client: HttpClient
  let fetchSpy: jest.SpyInstance

  beforeEach(() => {
    client = new HttpClient({ baseURL: BASE_URL })
    fetchSpy = jest.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    fetchSpy.mockRestore()
  })

  describe('constructor', () => {
    it('should strip trailing slash from baseURL', () => {
      const c = new HttpClient({ baseURL: 'http://api.example.com/' })
      expect(c.baseURL).toBe('http://api.example.com')
    })

    it('should keep baseURL without trailing slash unchanged', () => {
      expect(client.baseURL).toBe(BASE_URL)
    })

    it('should default credentials to omit', () => {
      expect(client.credentials).toBe('omit')
    })

    it('should set custom credentials', () => {
      const c = new HttpClient({ baseURL: BASE_URL, credentials: 'include' })
      expect(c.credentials).toBe('include')
    })

    it('should store token', () => {
      const token = faker.string.alphanumeric(32)
      const c = new HttpClient({ baseURL: BASE_URL, token })
      expect(c.token).toBe(token)
    })

    it('should have undefined token when not provided', () => {
      expect(client.token).toBeUndefined()
    })
  })

  describe('buildURL', () => {
    it('should prepend slash when url does not start with one', () => {
      expect(client.buildURL('users')).toBe(`${BASE_URL}/users`)
    })

    it('should not double the slash when url starts with one', () => {
      expect(client.buildURL('/users')).toBe(`${BASE_URL}/users`)
    })

    it('should append query params', () => {
      const url = client.buildURL('/users', { page: 1, active: true, role: 'ADMIN' })
      expect(url).toContain('page=1')
      expect(url).toContain('active=true')
      expect(url).toContain('role=ADMIN')
    })

    it('should return url without query string when params is empty', () => {
      expect(client.buildURL('/users', {})).toBe(`${BASE_URL}/users`)
    })
  })

  describe('parseResponse', () => {
    it('should return null when body is empty', async () => {
      const response = { headers: { get: () => 'application/json' }, text: async () => '' } as unknown as Response
      const result = await client.parseResponse(response)
      expect(result).toBeNull()
    })

    it('should parse JSON when content-type is application/json', async () => {
      const data = { id: faker.string.uuid() }
      const response = {
        headers: { get: () => 'application/json' },
        text: async () => JSON.stringify(data),
      } as unknown as Response
      const result = await client.parseResponse(response)
      expect(result).toEqual(data)
    })

    it('should return raw text when content-type is not json', async () => {
      const text = faker.lorem.sentence()
      const response = {
        headers: { get: () => 'text/plain' },
        text: async () => text,
      } as unknown as Response
      const result = await client.parseResponse(response)
      expect(result).toBe(text)
    })

    it('should return raw text when JSON.parse fails', async () => {
      const invalid = 'not valid json {'
      const response = {
        headers: { get: () => 'application/json' },
        text: async () => invalid,
      } as unknown as Response
      const result = await client.parseResponse(response)
      expect(result).toBe(invalid)
    })
  })

  describe('request', () => {
    it('should call fetch with Content-Type application/json', async () => {
      fetchSpy.mockResolvedValue(makeFetchResponse({ body: {} }))

      await client.request('GET', '/users')

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ headers: expect.objectContaining({ 'Content-Type': 'application/json' }) }),
      )
    })

    it('should include Authorization header when token is set', async () => {
      const token = faker.string.alphanumeric(32)
      const authedClient = new HttpClient({ baseURL: BASE_URL, token })
      fetchSpy.mockResolvedValue(makeFetchResponse({ body: {} }))

      await authedClient.request('GET', '/users')

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: `Bearer ${token}` }) }),
      )
    })

    it('should not include Authorization header when token is not set', async () => {
      fetchSpy.mockResolvedValue(makeFetchResponse({ body: {} }))

      await client.request('GET', '/users')

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit]
      expect((options.headers as Record<string, string>)['Authorization']).toBeUndefined()
    })

    it('should stringify and send body for POST', async () => {
      const payload = { name: faker.person.fullName() }
      fetchSpy.mockResolvedValue(makeFetchResponse({ body: {} }))

      await client.request('POST', '/users', { body: payload })

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: JSON.stringify(payload) }),
      )
    })

    it('should return parsed response on success', async () => {
      const data = { id: faker.string.uuid() }
      fetchSpy.mockResolvedValue(makeFetchResponse({ body: data, status: 200 }))

      const result = await client.request('GET', '/users')

      expect(result).toEqual({ data, status: 200, statusText: 'OK' })
    })

    it('should throw HttpError with status and data when response is not ok', async () => {
      const errorBody = { message: 'Not Found' }
      fetchSpy.mockResolvedValue(makeFetchResponse({ ok: false, status: 404, statusText: 'Not Found', body: errorBody }))

      await expect(client.request('GET', '/users/invalid')).rejects.toMatchObject({
        message: 'Not Found',
        status: 404,
        data: errorBody,
      })
    })

    it('should use statusText as error message when body has no message field', async () => {
      fetchSpy.mockResolvedValue(makeFetchResponse({ ok: false, status: 500, statusText: 'Internal Server Error', body: {} }))

      await expect(client.request('GET', '/users')).rejects.toMatchObject({
        message: 'Internal Server Error',
        status: 500,
      })
    })
  })

  describe('http methods', () => {
    beforeEach(() => {
      fetchSpy.mockResolvedValue(makeFetchResponse({ body: {} }))
    })

    it('get should call fetch with GET method', async () => {
      await client.get('/users')
      expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'GET' }))
    })

    it('post should call fetch with POST method', async () => {
      await client.post('/users', { name: 'John' })
      expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'POST' }))
    })

    it('put should call fetch with PUT method', async () => {
      await client.put('/users/1', { name: 'John' })
      expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'PUT' }))
    })

    it('patch should call fetch with PATCH method', async () => {
      await client.patch('/users/1', { name: 'John' })
      expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'PATCH' }))
    })

    it('delete should call fetch with DELETE method', async () => {
      await client.delete('/users/1')
      expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'DELETE' }))
    })
  })
})
