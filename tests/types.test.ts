/**
 * Unit tests for Speech Module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '../src/client'
import { T2AHttpResponse, T2AAsyncResponse } from '../src/types/speech'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Speech Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('synthesize (T2A HTTP)', () => {
    it('should synthesize speech successfully', async () => {
      const mockResponse: T2AHttpResponse = {
        data: {
          audio: 'hex_encoded_audio_data',
          status: 2
        },
        trace_id: 'trace-123',
        extra_info: {
          audio_length: 5000,
          audio_sample_rate: 32000,
          audio_size: 50000,
          bitrate: 128000,
          audio_format: 'mp3',
          audio_channel: 1,
          invisible_character_ratio: 0,
          usage_characters: 50,
          word_count: 10
        },
        base_resp: {
          status_code: 0,
          status_msg: 'success'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve(mockResponse)
      })

      const client = createClient('test-api-key')
      const response = await client.speech.synthesize({
        model: 'speech-2.8-hd',
        text: 'Hello world',
        voice_setting: {
          voice_id: 'male-qn-qingse',
          speed: 1.0
        }
      })

      expect(response.data.data?.audio).toBeDefined()
      expect(response.data.extra_info?.usage_characters).toBe(50)
    })
  })

  describe('createAsyncTask', () => {
    it('should create async task successfully', async () => {
      const mockResponse: T2AAsyncResponse = {
        task_id: 'task-123',
        file_id: 123456789,
        task_token: 'token-xyz',
        usage_characters: 100,
        base_resp: {
          status_code: 0,
          status_msg: 'success'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve(mockResponse)
      })

      const client = createClient('test-api-key')
      const response = await client.speech.createAsyncTask({
        model: 'speech-2.8-hd',
        text: 'Long text to synthesize',
        voice_setting: {
          voice_id: 'male-qn-qingse'
        }
      })

      expect(response.data.task_id).toBe('task-123')
      expect(response.data.file_id).toBe(123456789)
    })
  })

  describe('queryAsyncTask', () => {
    it('should query async task status', async () => {
      const mockResponse = {
        task_id: 'task-123',
        status: 'Success',
        file_id: 123456789,
        base_resp: {
          status_code: 0,
          status_msg: 'success'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve(mockResponse)
      })

      const client = createClient('test-api-key')
      const response = await client.speech.queryAsyncTask('task-123')

      expect(response.data.task_id).toBe('task-123')
      expect(response.data.status).toBe('Success')
    })
  })
})
