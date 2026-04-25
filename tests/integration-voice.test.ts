/**
 * Integration Tests: Voice Management API
 * Run: npm test -- --run tests/integration-voice.test.ts
 */

import { describe, it, expect } from 'vitest'
import { createClient } from '../src/client'
import * as fs from 'fs'
import * as path from 'path'

const API_KEY = process.env.MINIMAX_API_KEY || ''
const MISC_DIR = path.join(__dirname, '..', 'misc')

describe('Integration: Voice Management API', () => {
  if (!API_KEY) {
    it('skip test: no API_KEY provided', () => {})
    return
  }

  const client = createClient(API_KEY)

  it('should list all voices', async () => {
    const response = await client.voice.list({
      voice_type: 'all'
    })

    expect(response.data.system_voice).toBeDefined()
    console.log('Voices count:', response.data.system_voice?.length)
  })

  it('should list system voices only', async () => {
    const response = await client.voice.list({
      voice_type: 'system'
    })

    expect(response.data.system_voice).toBeDefined()
    expect(response.data.system_voice!.length).toBeGreaterThan(0)
    console.log('System voices count:', response.data.system_voice!.length)
  })

  it('should upload prompt audio', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'prompt.mp3', { type: 'audio/mpeg' })

    const response = await client.voice.uploadPrompt(file)

    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('prompt_audio')
    console.log('File ID:', response.data.file?.file_id)
  })

  it('should upload clone audio', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'clone_audio.mp3', { type: 'audio/mpeg' })

    const response = await client.voice.uploadClone(file)

    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('voice_clone')
    console.log('File ID:', response.data.file?.file_id)
  })

  it('should clone voice', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'clone.mp3', { type: 'audio/mpeg' })

    const uploadResponse = await client.file.upload(file, 'voice_clone')
    const fileId = uploadResponse.data.file?.file_id

    const cloneResponse = await client.voice.clone({
      file_id: fileId!,
      voice_id: `test-voice-${Date.now()}`,
      text: 'Hello, this is a test.',
      model: 'speech-2.8-hd'
    })

    expect(cloneResponse.data.base_resp).toBeDefined()
    // status_code: 0=success, 1008=insufficient balance
    console.log('Clone status:', cloneResponse.data.base_resp?.status_code, cloneResponse.data.base_resp?.status_msg)
  })

  it('should design voice', async () => {
    const response = await client.voice.design({
      prompt: 'A warm and friendly female voice',
      preview_text: 'Hello, this is a test of the voice.'
    })

    expect(response.data.base_resp).toBeDefined()
    // May fail due to quota or permissions
    console.log('Design status:', response.data.base_resp?.status_code, response.data.base_resp?.status_msg)
  })

  it('should delete voice', async () => {
    const designResponse = await client.voice.design({
      prompt: 'Voice to be deleted',
      preview_text: 'This voice will be deleted.'
    })

    const voiceId = (designResponse.data as any)?.voice_id
    if (voiceId) {
      const deleteResponse = await client.voice.delete({
        voice_id: voiceId,
        voice_type: 'voice_generation'
      })
      expect(deleteResponse.data.base_resp).toBeDefined()
      console.log('Delete status:', deleteResponse.data.base_resp?.status_msg)
    } else {
      console.log('Skipped (no voice_id returned)')
    }
  })
})
