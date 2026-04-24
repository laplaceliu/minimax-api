/**
 * HTTP client for MiniMax API
 * Supports both browser (fetch) and Node.js environments
 */

import { getAuthHeader } from './auth'
import { MiniMaxError, parseError, BaseResponse } from './errors'

export interface RequestOptions extends RequestInit {
  timeout?: number
}

export interface HttpResponse<T = unknown> {
  data: T
  status: number
  headers: Headers
}

export class HttpClient {
  private baseURL: string
  private apiKey: string
  private defaultHeaders: Record<string, string>
  private defaultTimeout: number

  constructor(apiKey: string, baseURL: string = 'https://api.minimaxi.com', timeout: number = 60000) {
    this.apiKey = apiKey
    this.baseURL = baseURL.replace(/\/$/, '')
    this.defaultTimeout = timeout
    this.defaultHeaders = {
      'Authorization': getAuthHeader(apiKey),
      'Content-Type': 'application/json',
    }
  }

  async request<T>(
    method: string,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseURL}${endpoint}`

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    }

    const controller = new AbortController()
    const timeout = options.timeout || this.defaultTimeout
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options.body,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const contentType = response.headers.get('content-type') || ''
      
      // Handle SSE/stream responses
      if (contentType.includes('text/event-stream') || options.signal) {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw parseError(errorData as BaseResponse)
        }
        return {
          data: response.body as unknown as T,
          status: response.status,
          headers: response.headers,
        }
      }

      const data = await response.json()

      if (!response.ok) {
        throw parseError(data as BaseResponse)
      }

      return {
        data: data as T,
        status: response.status,
        headers: response.headers,
      }
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new MiniMaxError('Request timeout', 408, 'TIMEOUT')
      }
      throw error
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('GET', endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('POST', endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', endpoint, { ...options, method: 'DELETE' })
  }

  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    _options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(this.apiKey),
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw parseError(data as BaseResponse)
    }

    return {
      data: data as T,
      status: response.status,
      headers: response.headers,
    }
  }
}
