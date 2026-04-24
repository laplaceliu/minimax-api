/**
 * Chat API module - Text completion with OpenAI and Anthropic compatible interfaces
 */

import { HttpClient, HttpResponse } from '../core/http'
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChunk,
  CreateMessageRequest,
  CreateMessageResponse,
  StreamEvent,
} from '../types/chat'

/**
 * Chat module for text completion
 */
export class ChatModule {
  constructor(private http: HttpClient) {}

  /**
   * OpenAI compatible chat completion
   * @see https://platform.minimaxi.com/docs/api-reference/text-chat-openai
   */
  async createCompletion(
    request: ChatCompletionRequest
  ): Promise<HttpResponse<ChatCompletionResponse>> {
    return this.http.post<ChatCompletionResponse>('/v1/chat/completions', request)
  }

  /**
   * OpenAI compatible streaming chat completion
   * @see https://platform.minimaxi.com/docs/api-reference/text-chat-openai
   */
  async createCompletionStream(
    request: ChatCompletionRequest
  ): Promise<HttpResponse<ChatCompletionChunk>> {
    return this.http.post<ChatCompletionChunk>('/v1/chat/completions', {
      ...request,
      stream: true,
    })
  }

  /**
   * Anthropic compatible message creation
   * @see https://platform.minimaxi.com/docs/api-reference/text-chat-anthropic
   */
  async createMessage(
    request: CreateMessageRequest
  ): Promise<HttpResponse<CreateMessageResponse>> {
    return this.http.post<CreateMessageResponse>('/anthropic/v1/messages', request)
  }

  /**
   * Anthropic compatible streaming message creation
   * @see https://platform.minimaxi.com/docs/api-reference/text-chat-anthropic
   */
  async createMessageStream(
    request: CreateMessageRequest
  ): Promise<HttpResponse<StreamEvent>> {
    return this.http.post<StreamEvent>('/anthropic/v1/messages', {
      ...request,
      stream: true,
    })
  }
}

/**
 * Helper function to parse SSE stream from chat completion
 */
export async function* parseSSEStream<T>(
  response: Response
): AsyncGenerator<T, void, unknown> {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Response body is not available')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') {
            return
          }
          yield JSON.parse(data) as T
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
