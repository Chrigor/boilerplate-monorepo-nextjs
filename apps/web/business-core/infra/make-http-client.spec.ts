import { HttpClient } from './client.http'
import { makeHttpClient } from './make-http-client'

describe('makeHttpClient', () => {
  const originalEnv = process.env.API_BASE_URL

  afterEach(() => {
    process.env.API_BASE_URL = originalEnv
  })

  it('should return an instance of HttpClient', () => {
    const client = makeHttpClient()

    expect(client).toBeInstanceOf(HttpClient)
  })

  it('should use API_BASE_URL from env when set', () => {
    process.env.API_BASE_URL = 'http://custom-api.example.com'

    const client = makeHttpClient()

    expect(client.baseURL).toBe('http://custom-api.example.com')
  })

  it('should fallback to http://localhost:3000 when API_BASE_URL is not set', () => {
    delete process.env.API_BASE_URL

    const client = makeHttpClient()

    expect(client.baseURL).toBe('http://localhost:3000')
  })
})
