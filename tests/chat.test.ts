/**
 * Unit tests for Chat Module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '../src/client'
import { ChatCompletionResponse, ChatCompletionChunk, CreateMessageResponse } from '../src/types/chat'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Chat Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createCompletion', () => {
    it('should create chat completion successfully', async () => {
      const mockResponse: ChatCompletionResponse = {
        id: 'test-id',
        choices: [{
          finish_reason: 'stop',
          index: 0,
          message: {
            content: 'Hello!',
            role: 'assistant'
          }
        }],
        created: 1234567890,
        model: 'MiniMax-M2.7',
        object: 'chat.completion',
        usage: {
          total_tokens: 10,
          prompt_tokens: 5,
          completion_tokens: 5
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve(mockResponse)
      })

      const client = createClient('test-api-key')
      const response = await client.chat.createCompletion({
        model: 'MiniMax-M2.7',
        messages: [{ role: 'user', content: 'Hello' }]
      })

      expect(response.data.id).toBe('test-id')
      expect(response.data.choices[0].message.content).toBe('Hello!')
    })

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({
          status_code: 1004,
          status_msg: 'Authentication failed'
        })
      })

      const client = createClient('test-api-key')
      
      await expect(
        client.chat.createCompletion({
          model: 'MiniMax-M2.7',
          messages: [{ role: 'user', content: 'Hello' }]
        })
      ).rejects.toThrow()
    })
  })

  describe('createMessage (Anthropic compatible)', () => {
    it('should create message successfully', async () => {
      const mockResponse: CreateMessageResponse = {
        id: 'msg-test-id',
        type: 'message',
        role: 'assistant',
        model: 'MiniMax-M2.7',
        content: [{
          type: 'text',
          text: 'Hi there!'
        }],
        stop_reason: 'end_turn',
        usage: {
          input_tokens: 10,
          output_tokens: 5
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve(mockResponse)
      })

      const client = createClient('test-api-key')
      const response = await client.chat.createMessage({
        model: 'MiniMax-M2.7',
        messages: [{ role: 'user', content: 'Hello' }]
      })

      expect(response.data.id).toBe('msg-test-id')
      expect(response.data.content[0].text).toBe('Hi there!')
    })
  })
})
