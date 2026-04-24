/**
 * Integration tests for MiniMax API
 * These tests call the real API and require a valid API key
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { createClient, MiniMaxClient } from '../src/client'
import * as fs from 'fs'
import * as path from 'path'

// Load API key from environment or .env.local
const API_KEY = process.env.MINIMAX_API_KEY || ''

// Test files path
const MISC_DIR = path.join(__dirname, '..', 'misc')
const OUTPUT_DIR = path.join(MISC_DIR, 'output')

describe('Integration: Chat API', () => {
  const client = createClient(API_KEY)

  it('should complete chat with MiniMax-M2.7', async () => {
    const response = await client.chat.createCompletion({
      model: 'MiniMax-M2.7',
      messages: [
        { role: 'user', content: 'Say "Hello" in Chinese' }
      ],
      max_completion_tokens: 50
    })

    expect(response.data.id).toBeDefined()
    expect(response.data.choices[0].message.content).toBeDefined()
    console.log('Chat response:', response.data.choices[0].message.content)
  })

  it('should work with Anthropic compatible API', async () => {
    const response = await client.chat.createMessage({
      model: 'MiniMax-M2.7',
      messages: [
        { role: 'user', content: 'What is 2+2?' }
      ],
      max_tokens: 50
    })

    expect(response.data.id).toBeDefined()
    expect(response.data.content).toBeDefined()
    console.log('Anthropic API response:', response.data.content)
  }, 15000)
})

describe('Integration: Speech (T2A) API', () => {
  const client = createClient(API_KEY)

  it('should synthesize speech synchronously', async () => {
    const response = await client.speech.synthesize({
      model: 'speech-2.8-hd',
      text: '你好，世界！这是一个语音合成测试。',
      voice_setting: {
        voice_id: 'Chinese (Mandarin)_Lyrical_Voice',
        speed: 1.0
      },
      audio_setting: {
        sample_rate: 32000,
        format: 'mp3'
      }
    })

    expect(response.data.data?.audio).toBeDefined()
    expect(response.data.extra_info?.usage_characters).toBeGreaterThan(0)
    console.log('T2A characters used:', response.data.extra_info?.usage_characters)

    // Save audio to file
    if (response.data.data?.audio) {
      const audioBuffer = Buffer.from(response.data.data.audio, 'hex')
      const outputPath = path.join(OUTPUT_DIR, 'speech.mp3')
      fs.writeFileSync(outputPath, audioBuffer)
      console.log('Speech audio saved to:', outputPath)
    }
  })

  it('should create async T2A task', async () => {
    const response = await client.speech.createAsyncTask({
      model: 'speech-2.8-hd',
      text: '这是一个长文本语音合成的异步任务测试。',
      voice_setting: {
        voice_id: 'Chinese (Mandarin)_Lyrical_Voice'
      }
    })

    expect(response.data.task_id).toBeDefined()
    console.log('Async task ID:', response.data.task_id)
  })

  it('should query async T2A task status', async () => {
    // First create a task
    const createResponse = await client.speech.createAsyncTask({
      model: 'speech-2.8-hd',
      text: '查询异步任务状态测试。',
      voice_setting: {
        voice_id: 'Chinese (Mandarin)_Lyrical_Voice'
      }
    })

    const taskId = createResponse.data.task_id
    expect(taskId).toBeDefined()

    // Query the task
    const queryResponse = await client.speech.queryAsyncTask(taskId!)

    expect(queryResponse.data.task_id).toBeDefined()
    expect(queryResponse.data.base_resp).toBeDefined()
    console.log('Async task status:', queryResponse.data.status)
  })
})

describe('Integration: Voice Management API', () => {
  const client = createClient(API_KEY)

  it('should list all voices', async () => {
    const response = await client.voice.list({
      voice_type: 'all'
    })

    expect(response.data.system_voice).toBeDefined()
    console.log('System voices count:', response.data.system_voice?.length)
  })

  it('should list system voices only', async () => {
    const response = await client.voice.list({
      voice_type: 'system'
    })

    expect(response.data.system_voice).toBeDefined()
    expect(response.data.system_voice!.length).toBeGreaterThan(0)
  })

  it('should upload prompt audio for voice cloning', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'prompt.mp3', { type: 'audio/mpeg' })

    const response = await client.voice.uploadPrompt(file)

    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('prompt_audio')
    console.log('Uploaded prompt file_id:', response.data.file?.file_id)
  })

  it('should upload clone audio for voice cloning', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'clone_audio.mp3', { type: 'audio/mpeg' })

    const response = await client.voice.uploadClone(file)

    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('voice_clone')
    console.log('Uploaded clone audio file_id:', response.data.file?.file_id)
  })
})

describe('Integration: Image Generation API', () => {
  const client = createClient(API_KEY)

  it('should generate image from text', async () => {
    const response = await client.image.generateFromText({
      model: 'image-01',
      prompt: 'A cute cat sitting on a windowsill, sunny day, photorealistic',
      aspect_ratio: '1:1',
      n: 1
    })

    expect(response.data.id).toBeDefined()
    expect(response.data.data.image_urls).toBeDefined()
    expect(response.data.data.image_urls!.length).toBe(1)
    console.log('Generated image URL:', response.data.data.image_urls?.[0])

    // Save first image URL for I2V test
    if (response.data.data.image_urls?.[0]) {
      fs.writeFileSync(path.join(OUTPUT_DIR, 'generated_image_url.txt'), response.data.data.image_urls[0])
      console.log('Image URL saved for I2V test')
    }
  }, 30000)

  it('should generate image from image (I2I)', async () => {
    // First generate an image
    const genResponse = await client.image.generateFromText({
      model: 'image-01',
      prompt: 'A beautiful flower garden with butterflies',
      aspect_ratio: '1:1',
      n: 1
    })

    expect(genResponse.data.data.image_urls).toBeDefined()
    const imageUrl = genResponse.data.data.image_urls?.[0]
    expect(imageUrl).toBeDefined()

    // Use the generated image URL for I2I
    const response = await client.image.generateFromImage({
      model: 'image-01',
      prompt: 'Transform this into a watercolor painting style',
      image_url: imageUrl
    })

    expect(response.data.id).toBeDefined()
    expect(response.data.base_resp).toBeDefined()
    console.log('I2I task ID:', response.data.id)
  }, 60000)
})

describe('Integration: Video Generation API', () => {
  const client = createClient(API_KEY)

  it('should create text-to-video task', async () => {
    const response = await client.video.generateFromText({
      model: 'MiniMax-Hailuo-2.3',
      prompt: 'A person walking in the park, sunny day',
      duration: 6,
      resolution: '768P'
    })

    expect(response.data.task_id).toBeDefined()
    console.log('Video task ID:', response.data.task_id)
  })

  it('should create image-to-video task', async () => {
    // Use the test image from misc directory
    const imagePath = path.join(MISC_DIR, 'minimax-api-test.jpeg')
    const imageUrl = `file://${imagePath}`

    const response = await client.video.generateFromImage({
      model: 'MiniMax-Hailuo-02', // or try 'Hailuo-2.3-Fast-768P'
      prompt: 'The person is walking towards the camera',
      image_url: imageUrl
    })

    expect(response.data.task_id).toBeDefined()
    console.log('I2V task ID:', response.data.task_id)
  })
})

describe('Integration: Music Generation API', () => {
  // Music generation needs longer timeout (6 minutes)
  const client = new MiniMaxClient({
    apiKey: API_KEY,
    timeout: 360000
  })

  it('should generate instrumental music', async () => {
    const response = await client.music.generate({
      model: 'music-2.6',
      prompt: 'Upbeat pop music, happy mood',
      is_instrumental: true
    })

    expect(response.data.base_resp.status_code).toBe(0)
    expect(response.data.data?.status).toBe(2)
    console.log('Music generation:', {
      status: response.data.data?.status,
      duration: response.data.extra_info?.music_duration,
      size: response.data.extra_info?.music_size
    })

    // Save audio to file
    if (response.data.data?.audio) {
      const audioBuffer = Buffer.from(response.data.data.audio, 'hex')
      const outputPath = path.join(OUTPUT_DIR, 'instrumental.mp3')
      fs.writeFileSync(outputPath, audioBuffer)
      console.log('Audio saved to:', outputPath)
    }
  }, 360000)

  it('should generate lyrics', async () => {
    const response = await client.music.generateLyrics({
      mode: 'write_full_song',
      prompt: 'A song about summer happiness and freedom'
    })

    expect(response.data.base_resp.status_code).toBe(0)
    expect(response.data.lyrics).toBeDefined()
    expect(response.data.song_title).toBeDefined()
    console.log('Generated lyrics:', {
      title: response.data.song_title,
      style_tags: response.data.style_tags,
      lyrics_preview: response.data.lyrics?.substring(0, 100)
    })

    // Save lyrics to file
    if (response.data.lyrics) {
      const lyricsContent = `# ${response.data.song_title}\n`
        + `# Style: ${response.data.style_tags}\n\n`
        + response.data.lyrics
      const outputPath = path.join(OUTPUT_DIR, 'lyrics.txt')
      fs.writeFileSync(outputPath, lyricsContent, 'utf-8')
      console.log('Lyrics saved to:', outputPath)
    }
  }, 30000)

  it('should generate music with lyrics', async () => {
    const response = await client.music.generate({
      model: 'music-2.6',
      prompt: 'Romantic ballad, emotional vocals',
      lyrics: `[Verse]
Under the moonlight we dance
Holding hands, taking a chance
Every moment feels so right
[Chorus]
Love is in the air tonight`,
      is_instrumental: false
    })

    expect(response.data.base_resp.status_code).toBe(0)
    console.log('Music with lyrics:', {
      status: response.data.data?.status,
      duration: response.data.extra_info?.music_duration,
      size: response.data.extra_info?.music_size
    })

    // Save audio to file
    if (response.data.data?.audio) {
      const audioBuffer = Buffer.from(response.data.data.audio, 'hex')
      const outputPath = path.join(OUTPUT_DIR, 'with_lyrics.mp3')
      fs.writeFileSync(outputPath, audioBuffer)
      console.log('Audio saved to:', outputPath)
    }
  }, 360000)
})

describe('Integration: File Management API', () => {
  const client = createClient(API_KEY)

  it('should list files by purpose', async () => {
    const response = await client.file.list('voice_clone')
    
    expect(response.data.files).toBeDefined()
    console.log('Voice clone files count:', response.data.files.length)
  })

  it('should list t2a_async files', async () => {
    const response = await client.file.list('t2a_async_input')
    
    expect(response.data.files).toBeDefined()
    console.log('T2A async files count:', response.data.files.length)
  })

  it('should retrieve file information', async () => {
    // First upload a file
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'retrieve_test.mp3', { type: 'audio/mpeg' })
    
    const uploadResponse = await client.file.upload(file, 'voice_clone')
    const fileId = uploadResponse.data.file?.file_id

    // Retrieve the file
    const retrieveResponse = await client.file.retrieve(String(fileId))

    expect(retrieveResponse.data.file).toBeDefined()
    expect(retrieveResponse.data.file?.file_id).toBe(fileId)
    console.log('Retrieved file:', retrieveResponse.data.file?.filename)
  })

  it('should delete a file', async () => {
    // First upload a file
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'delete_test.mp3', { type: 'audio/mpeg' })
    
    const uploadResponse = await client.file.upload(file, 'voice_clone')
    const fileId = uploadResponse.data.file?.file_id

    // Delete the file
    const deleteResponse = await client.file.delete(String(fileId))

    expect(deleteResponse.data.base_resp).toBeDefined()
    expect(deleteResponse.data.base_resp?.status_code).toBe(0)
    console.log('File deleted successfully')
  })
})
