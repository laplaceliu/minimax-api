/**
 * Integration Tests: Speech (TTS) API
 * Run: npm test --run tests/integration-speech.test.ts
 */

import { describe, it, expect } from 'vitest'
import { createClient } from '../src/client'
import * as fs from 'fs'
import * as path from 'path'

const API_KEY = process.env.MINIMAX_API_KEY || ''
const OUTPUT_DIR = path.join(__dirname, '..', 'misc', 'output')

const OUTPUT = path.join(OUTPUT_DIR, 'speech')
const FILES = {
  mp3: path.join(OUTPUT, 'speech.mp3'),
  wav: path.join(OUTPUT, 'speech.wav'),
  pcm: path.join(OUTPUT, 'speech.pcm'),
}

describe('Integration: Speech (TTS) API', () => {
  if (!API_KEY) {
    it('skip test: no API_KEY provided', () => {})
    return
  }

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
    expect(response.data.extra_info?.usage_characters).toBeDefined()
    console.log('Characters:', response.data.extra_info?.usage_characters)

    if (response.data.data?.audio) {
      const buf = Buffer.from(response.data.data.audio, 'hex')
      fs.writeFileSync(FILES.mp3, buf)
      console.log('Saved:', FILES.mp3)
    }
  })

  it('should create async TTS task', async () => {
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

  it('should query async TTS task status', async () => {
    const create = await client.speech.createAsyncTask({
      model: 'speech-2.8-hd',
      text: '查询状态测试。',
      voice_setting: {
        voice_id: 'Chinese (Mandarin)_Lyrical_Voice'
      }
    })

    expect(create.data.task_id).toBeDefined()
    const query = await client.speech.queryAsyncTask(create.data.task_id!)
    expect(query.data.task_id).toBeDefined()
    console.log('Status:', query.data.status)
  })

  it('should create WebSocket client', async () => {
    const ws = client.speech.createWebSocketClient()
    expect(ws).toBeDefined()
    console.log('WebSocket client created')
    ws.close()
  })

  it('should initiate streaming TTS', async () => {
    const response = await client.speech.synthesizeStream({
      model: 'speech-2.8-hd',
      text: 'Streaming test.',
      voice_setting: {
        voice_id: 'Chinese (Mandarin)_Lyrical_Voice'
      }
    })

    expect(response.status).toBe(200)
    console.log('Stream initiated, status:', response.status)
  })
})
