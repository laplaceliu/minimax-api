/**
 * Speech (T2A) API module - Text-to-Audio synthesis
 */

import { HttpClient, HttpResponse } from '../core/http'
import { WebSocketClient } from '../core/websocket'
import {
  T2AHttpRequest,
  T2AHttpResponse,
  T2AAsyncRequest,
  T2AAsyncResponse,
  T2AAsyncQueryResponse,
  T2AWebSocketStartEvent,
  T2AWebSocketContinueEvent,
  T2AWebSocketFinishEvent,
  T2AWebSocketResponse,
} from '../types/speech'

/**
 * Speech synthesis module for T2A (Text-to-Audio)
 */
export class SpeechModule {
  constructor(
    private http: HttpClient,
    private apiKey: string
  ) {}

  /**
   * Synchronous text-to-audio HTTP API
   * @see https://platform.minimaxi.com/docs/api-reference/speech-t2a-http
   */
  async synthesize(
    request: T2AHttpRequest
  ): Promise<HttpResponse<T2AHttpResponse>> {
    return this.http.post<T2AHttpResponse>('/v1/t2a_v2', request)
  }

  /**
   * Synchronous streaming text-to-audio HTTP API
   * @see https://platform.minimaxi.com/docs/api-reference/speech-t2a-http
   */
  async synthesizeStream(
    request: T2AHttpRequest
  ): Promise<HttpResponse<T2AHttpResponse>> {
    return this.http.post<T2AHttpResponse>('/v1/t2a_v2', {
      ...request,
      stream: true,
    })
  }

  /**
   * Create async text-to-audio task
   * @see https://platform.minimaxi.com/docs/api-reference/speech-t2a-async-create
   */
  async createAsyncTask(
    request: T2AAsyncRequest
  ): Promise<HttpResponse<T2AAsyncResponse>> {
    return this.http.post<T2AAsyncResponse>('/v1/t2a_async_v2', request)
  }

  /**
   * Query async text-to-audio task status
   * @see https://platform.minimaxi.com/docs/api-reference/speech-t2a-async-query
   */
  async queryAsyncTask(
    taskId: string | number
  ): Promise<HttpResponse<T2AAsyncQueryResponse>> {
    return this.http.get<T2AAsyncQueryResponse>(`/v1/query/t2a_async_query_v2?task_id=${taskId}`)
  }

  /**
   * Create WebSocket client for real-time T2A
   * @see https://platform.minimaxi.com/docs/api-reference/speech-t2a-websocket
   */
  createWebSocketClient(): WebSocketClient {
    return new WebSocketClient(this.apiKey, 'wss://api.minimaxi.com/ws/v1/t2a_v2')
  }

  /**
   * Real-time T2A via WebSocket
   */
  async* synthesizeWebSocket(
    events: AsyncIterable<T2AWebSocketStartEvent | T2AWebSocketContinueEvent | T2AWebSocketFinishEvent>
  ): AsyncGenerator<T2AWebSocketResponse, void, unknown> {
    const ws = this.createWebSocketClient()
    
    try {
      await ws.connect()
      
      for await (const event of events) {
        ws.send(event)
        
        // For simplicity, using a promise-based approach
        // In production, you'd want proper async iteration
        yield await new Promise<T2AWebSocketResponse>((resolve) => {
          ws.on('message', (data) => {
            resolve(data as T2AWebSocketResponse)
          })
        })
      }
    } finally {
      ws.close()
    }
  }
}
