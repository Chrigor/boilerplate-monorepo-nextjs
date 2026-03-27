export interface HttpConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  signal?: AbortSignal
}

export interface HttpResponse<T = unknown> {
  data: T
  status: number
  statusText: string
}

export interface HttpError extends Error {
  status: number
  data: unknown
}

interface HttpClientOptions {
  baseURL: string
  credentials?: RequestCredentials
  token?: string
}

export class HttpClient {
  private readonly _baseURL: string
  private readonly _credentials: RequestCredentials
  private readonly _token?: string

  constructor({ baseURL, credentials = 'omit', token }: HttpClientOptions) {
    this._baseURL = baseURL.endsWith('/')
      ? baseURL.slice(0, -1)
      : baseURL
    this._credentials = credentials
    this._token = token
  }

  get baseURL(): string {
    return this._baseURL
  }

  get credentials(): RequestCredentials {
    return this._credentials
  }

  get token(): string | undefined {
    return this._token
  }

  get<T>(url: string, config?: HttpConfig) {
    return this.request<T>('GET', url, config)
  }

  post<T>(url: string, data?: unknown, config?: HttpConfig) {
    return this.request<T>('POST', url, { ...config, body: data })
  }

  put<T>(url: string, data?: unknown, config?: HttpConfig) {
    return this.request<T>('PUT', url, { ...config, body: data })
  }

  patch<T>(url: string, data?: unknown, config?: HttpConfig) {
    return this.request<T>('PATCH', url, { ...config, body: data })
  }

  delete<T>(url: string, config?: HttpConfig) {
    return this.request<T>('DELETE', url, config)
  }

  public async request<T>(
    method: string,
    url: string,
    config: HttpConfig & { body?: unknown } = {},
  ): Promise<HttpResponse<T>> {
    const fullURL = this.buildURL(url, config.params)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(fullURL, {
      method,
      headers,
      credentials: this.credentials,
      signal: config.signal,
      body: config.body ? JSON.stringify(config.body) : undefined,
    })

    const data = await this.parseResponse<T>(response)

    if (!response.ok) {
      const message
        = typeof data === 'object' && data !== null && 'message' in data
          ? String((data as any).message)
          : response.statusText

      const error = new Error(message) as HttpError

      error.status = response.status
      error.data = data
      throw error
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    }
  }

  public buildURL(
    url: string,
    params?: Record<string, string | number | boolean>,
  ) {
    const path = url.startsWith('/') ? url : `/${url}`
    const fullURL = `${this.baseURL}${path}`

    if (!params || Object.keys(params).length === 0) {
      return fullURL
    }

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, String(value))
    }

    return `${fullURL}?${searchParams.toString()}`
  }

  public async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const text = await response.text()

    if (!text)
      return null as T

    if (contentType?.includes('application/json')) {
      try {
        return JSON.parse(text) as T
      }
      catch {
        return text as T
      }
    }

    return text as T
  }
}
