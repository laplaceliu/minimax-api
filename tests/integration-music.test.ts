/**
 * Integration Tests: Music Generation API
 * Run: npm test --run tests/integration-music.test.ts
 */

import { describe, it, expect } from 'vitest'
import { MiniMaxClient } from '../src/client'
import * as fs from 'fs'
import * as path from 'path'

const API_KEY = process.env.MINIMAX_API_KEY || ''
const OUTPUT = path.join(__dirname, '..', 'misc', 'output')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT)) {
  fs.mkdirSync(OUTPUT, { recursive: true })
}

describe('Integration: Music Generation API', () => {
  if (!API_KEY) {
    it('skip test: no API_KEY provided', () => {})
    return
  }

  const client = new MiniMaxClient({ apiKey: API_KEY, timeout: 360000 })

  it('should generate instrumental music', async () => {
    const response = await client.music.generate({
      model: 'music-2.6',
      prompt: 'Upbeat pop music, happy mood',
      is_instrumental: true
    })

    expect(response.data.base_resp.status_code).toBe(0)
    expect(response.data.data?.status).toBe(2)

    if (response.data.data?.audio) {
      const buf = Buffer.from(response.data.data.audio, 'hex')
      const filePath = path.join(OUTPUT, 'instrumental.mp3')
      fs.writeFileSync(filePath, buf)
      console.log('Saved:', filePath, `(${response.data.extra_info?.music_duration}ms)`)
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

    if (response.data.lyrics) {
      const content = `# ${response.data.song_title}\n# Style: ${response.data.style_tags}\n\n${response.data.lyrics}`
      const filePath = path.join(OUTPUT, 'lyrics.txt')
      fs.writeFileSync(filePath, content, 'utf-8')
      console.log('Saved lyrics:', filePath)
    }
  }, 30000)

  it('should generate music with lyrics', async () => {
    const response = await client.music.generate({
      model: 'music-2.6',
      prompt: 'Romantic ballad, emotional vocals',
      lyrics: `[Verse]\nUnder the moonlight we dance\nHolding hands, taking a chance\nEvery moment feels so right\n[Chorus]\nLove is in the air tonight`,
      is_instrumental: false
    })

    expect(response.data.base_resp.status_code).toBe(0)

    if (response.data.data?.audio) {
      const buf = Buffer.from(response.data.data.audio, 'hex')
      const filePath = path.join(OUTPUT, 'music_with_lyrics.mp3')
      fs.writeFileSync(filePath, buf)
      console.log('Saved:', filePath, `(${response.data.extra_info?.music_duration}ms)`)
    }
  }, 360000)

  it('should initiate music stream', async () => {
    const response = await client.music.generateStream({
      model: 'music-2.6',
      prompt: 'Upbeat pop music',
      is_instrumental: true
    })

    expect(response.status).toBe(200)
    console.log('Stream initiated, status:', response.status)
  }, 60000)

  it('should upload cover file', async () => {
    const coverPath = path.join(__dirname, '..', 'misc', 'minimax-api-cover.mp3')
    const buf = fs.readFileSync(coverPath)
    const file = new File([buf], 'cover.mp3', { type: 'audio/mpeg' })
    const uploadResp = await client.file.upload(file, 'voice_clone')
    console.log('Cover uploaded:', uploadResp.data.file?.file_id)
  })

  it('should preprocess music cover', async () => {
    const response = await client.music.preprocessCover({
      model: 'music-cover',
      audio_url: 'https://www.example.com/sample-music.mp3'
    })

    expect(response.data.cover_feature_id).toBeDefined()
    console.log('Cover feature ID:', response.data.cover_feature_id)
  })
})
