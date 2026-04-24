/**
 * WebSocket client for MiniMax API real-time features
 */

import { MiniMaxError } from './errors'
import { getAuthHeader } from './auth'

export type WebSocketEventType = 
  | 'open'
  | 'message'
  | 'error'
  | 'close'

export interface WebSocketMessage {
  event?: string
  data?: unknown
  error?: string
}

export class WebSocketClient {
  private ws: WebSocket | null = null
  private apiKey: string
  private url: string
  private listeners: Map<WebSocketEventType, Set<(data: unknown) => void>> = new Map()

  constructor(apiKey: string, url: string) {
    this.apiKey = apiKey
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = new URL(this.url)
        wsUrl.searchParams.set('Authorization', getAuthHeader(this.apiKey))
        
        this.ws = new WebSocket(wsUrl.toString())

        this.ws.onopen = () => {
          this.emit('open', {})
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.emit('message', data)
          } catch {
            this.emit('message', event.data)
          }
        }

        this.ws.onerror = (event) => {
          this.emit('error', event)
        }

        this.ws.onclose = (event) => {
          this.emit('close', { code: event.code, reason: event.reason })
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  send(data: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new MiniMaxError('WebSocket is not connected', undefined, 'WS_NOT_CONNECTED')
    }
    this.ws.send(JSON.stringify(data))
  }

  close(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  on(event: WebSocketEventType, callback: (data: unknown) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: WebSocketEventType, callback: (data: unknown) => void): void {
    this.listeners.get(event)?.delete(callback)
  }

  private emit(event: WebSocketEventType, data: unknown): void {
    this.listeners.get(event)?.forEach((callback) => callback(data))
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}
