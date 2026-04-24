/**
 * Unit tests for Video Module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '../src/client'
import { VideoGenerationResponse, VideoQueryResponse } from '../src/types/video'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Video Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateFromText (T2V)', () => {
    it('should generate video successfully', async () => {
      const mockResponse: VideoGenerationResponse = {
        task_id: 'video-task-123',
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
      const response = await client.video.generateFromText({
        model: 'MiniMax-Hailuo-2.3',
        prompt: 'A man reading a book',
        duration: 6,
        resolution: '1080P'
      })

      expect(response.data.task_id).toBe('video-task-123')
    })
  })

  describe('query', () => {
    it('should query video status successfully', async () => {
      const mockResponse: VideoQueryResponse = {
        task_id: 'video-task-123',
        status: 'Success',
        file_id: '205258526306433',
        video_width: 1920,
        video_height: 1080,
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
      const response = await client.video.query('video-task-123')

      expect(response.data.status).toBe('Success')
      expect(response.data.video_width).toBe(1920)
      expect(response.data.video_height).toBe(1080)
    })

    it('should handle processing status', async () => {
      const mockResponse: VideoQueryResponse = {
        task_id: 'video-task-123',
        status: 'Processing',
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
      const response = await client.video.query('video-task-123')

      expect(response.data.status).toBe('Processing')
      expect(response.data.file_id).toBeUndefined()
    })
  })

  describe('generateFromImage (I2V)', () => {
    it('should generate video from image', async () => {
      const mockResponse: VideoGenerationResponse = {
        task_id: 'i2v-task-456',
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
      const response = await client.video.generateFromImage({
        model: 'MiniMax-Hailuo-02',
        prompt: 'The person is walking',
        image_url: 'https://example.com/person.jpg'
      })

      expect(response.data.task_id).toBe('i2v-task-456')
    })
  })
})
