/**
 * Integration Tests: Image Generation API
 * Run: npm test --run tests/integration-image.test.ts
 */

import { describe, it, expect } from 'vitest'
import { createClient } from '../src/client'
import * as fs from 'fs'
import * as path from 'path'

const API_KEY = process.env.MINIMAX_API_KEY || ''
const OUTPUT_DIR = path.join(__dirname, '..', 'misc', 'output')

describe('Integration: Image Generation API', () => {
  if (!API_KEY) {
    it('skip test: no API_KEY provided', () => {})
    return
  }

  const client = createClient(API_KEY)

  it('should generate T2I image', async () => {
    const response = await client.image.generateFromText({
      model: 'image-01',
      prompt: 'A cute cat sitting on a windowsill, sunny day, photorealistic',
      aspect_ratio: '1:1',
      n: 1
    })

    expect(response.data.id).toBeDefined()
    expect(response.data.data.image_urls).toBeDefined()
    expect(response.data.data.image_urls!.length).toBe(1)
    console.log('Image URL:', response.data.data.image_urls?.[0])
  }, 30000)

  it('should generate I2I image', async () => {
    const genResponse = await client.image.generateFromText({
      model: 'image-01',
      prompt: 'A beautiful flower garden with butterflies',
      aspect_ratio: '1:1',
      n: 1
    })

    expect(genResponse.data.data.image_urls).toBeDefined()
    const imageUrl = genResponse.data.data.image_urls?.[0]
    expect(imageUrl).toBeDefined()

    const response = await client.image.generateFromImage({
      model: 'image-01',
      prompt: 'Transform this into a watercolor painting style',
      image_url: imageUrl
    })

    expect(response.data.id).toBeDefined()
    expect(response.data.base_resp).toBeDefined()
    console.log('I2I Task ID:', response.data.id)
  }, 60000)
})
