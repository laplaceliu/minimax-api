/**
 * Unit tests for Image Module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '../src/client'
import { ImageGenerationResponse } from '../src/types/image'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Image Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateFromText (T2I)', () => {
    it('should generate image successfully', async () => {
      const mockResponse: ImageGenerationResponse = {
        id: 'img-123',
        data: {
          image_urls: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg'
          ]
        },
        metadata: {
          success_count: 2,
          failed_count: 0
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
      const response = await client.image.generateFromText({
        model: 'image-01',
        prompt: 'A beautiful sunset',
        aspect_ratio: '16:9',
        n: 2
      })

      expect(response.data.id).toBe('img-123')
      expect(response.data.data.image_urls).toHaveLength(2)
      expect(response.data.metadata?.success_count).toBe(2)
    })

    it('should generate image with base64 format', async () => {
      const mockResponse: ImageGenerationResponse = {
        id: 'img-456',
        data: {
          image_base64: [
            'base64encodedimage1',
            'base64encodedimage2',
            'base64encodedimage3'
          ]
        },
        metadata: {
          success_count: 3,
          failed_count: 0
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
      const response = await client.image.generateFromText({
        model: 'image-01',
        prompt: 'A cat sitting on a chair',
        response_format: 'base64',
        n: 3
      })

      expect(response.data.data.image_base64).toHaveLength(3)
    })
  })

  describe('generateFromImage (I2I)', () => {
    it('should transform image successfully', async () => {
      const mockResponse: ImageGenerationResponse = {
        id: 'i2i-789',
        data: {
          image_urls: ['https://example.com/transformed.jpg']
        },
        metadata: {
          success_count: 1,
          failed_count: 0
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
      const response = await client.image.generateFromImage({
        model: 'image-01',
        prompt: 'Transform to watercolor style',
        subject_reference: [{
          type: 'character',
          image_file: 'https://example.com/original.jpg'
        }]
      })

      expect(response.data.id).toBe('i2i-789')
      expect(response.data.data.image_urls).toHaveLength(1)
    })
  })
})
