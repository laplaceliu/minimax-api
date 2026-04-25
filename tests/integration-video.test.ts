/**
 * Integration Tests: Video Generation API
 * Run: npm test --run tests/integration-video.test.ts
 */

import { describe, it, expect } from 'vitest'
import { createClient } from '../src/client'
import * as path from 'path'

const API_KEY = process.env.MINIMAX_API_KEY || ''
const MISC_DIR = path.join(__dirname, '..', 'misc')

describe('Integration: Video Generation API', () => {
  if (!API_KEY) {
    it('skip test: no API_KEY provided', () => {})
    return
  }

  const client = createClient(API_KEY)

  it('should create T2V task', async () => {
    const response = await client.video.generateFromText({
      model: 'MiniMax-Hailuo-2.3',
      prompt: 'A person walking in the park, sunny day',
      duration: 6,
      resolution: '768P'
    })

    expect(response.data.task_id).toBeDefined()
    console.log('Task ID:', response.data.task_id)
  })

  it('should query video task status', async () => {
    const createResponse = await client.video.generateFromText({
      model: 'MiniMax-Hailuo-2.3',
      prompt: 'A cat sitting on a windowsill',
      duration: 6
    })

    expect(createResponse.data.task_id).toBeDefined()
    const queryResponse = await client.video.query(createResponse.data.task_id!)
    expect(queryResponse.data.task_id).toBeDefined()
    console.log('Status:', queryResponse.data.status)
  })

  it('should create I2V task', async () => {
    const imagePath = path.join(MISC_DIR, 'minimax-api-test.jpeg')
    const response = await client.video.generateFromImage({
      model: 'MiniMax-Hailuo-02',
      prompt: 'The person walking towards the camera',
      first_frame_image: `file://${imagePath}`
    })

    expect(response.data.task_id).toBeDefined()
    console.log('I2V Task ID:', response.data.task_id)
  })

  it('should create S2V task', async () => {
    const response = await client.video.generateSubjectVideo({
      model: 'S2V-01',
      prompt: 'A person dancing',
      subject_reference: [{
        type: 'character',
        image: ['https://www.example.com/person.jpg']
      }]
    })

    expect(response.data.task_id).toBeDefined()
    console.log('S2V Task ID:', response.data.task_id)
  })

  it('should create FL2V task', async () => {
    const response = await client.video.generateFirstLetterVideo({
      model: 'MiniMax-Hailuo-02',
      prompt: 'A person reading a book',
      first_frame_image: 'https://www.example.com/start.jpg',
      last_frame_image: 'https://www.example.com/end.jpg'
    })

    expect(response.data.task_id).toBeDefined()
    console.log('FL2V Task ID:', response.data.task_id)
  })

  it('should download video file', async () => {
    // First create a video task
    const createResponse = await client.video.generateFromText({
      model: 'MiniMax-Hailuo-2.3',
      prompt: 'A person reading a book',
      duration: 6
    })

    expect(createResponse.data.task_id).toBeDefined()
    console.log('Task created for download test:', createResponse.data.task_id)

    // Query status to get file_id
    const queryResponse = await client.video.query(createResponse.data.task_id!)
    if (queryResponse.data.file_id) {
      const downloadResponse = await client.video.download(queryResponse.data.file_id)
      expect(downloadResponse.data.file).toBeDefined()
      expect(downloadResponse.data.file?.download_url).toBeDefined()
      console.log('Download URL:', downloadResponse.data.file?.download_url)
    }
  })
})
