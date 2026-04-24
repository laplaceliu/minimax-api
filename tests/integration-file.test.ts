/**
 * Integration tests for File Upload with real test files
 */

import { describe, it, expect } from 'vitest'
import { createClient } from '../src/client'
import * as fs from 'fs'
import * as path from 'path'

const API_KEY = process.env.MINIMAX_API_KEY || ''

const MISC_DIR = path.join(__dirname, '..', 'misc')

describe('Integration: File Upload', () => {
  const client = createClient(API_KEY)

  it('should upload voice clone audio file (mp3)', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    
    // Use File instead of Blob to preserve filename extension
    const file = new File([fileBuffer], 'minimax-api-test.mp3', { type: 'audio/mpeg' })
    
    const response = await client.file.upload(file, 'voice_clone')
    
    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('voice_clone')
    expect(response.data.base_resp?.status_code).toBe(0)
    
    console.log('Uploaded voice file:', {
      file_id: response.data.file?.file_id,
      filename: response.data.file?.filename,
      bytes: response.data.file?.bytes
    })
  })

  it('should upload prompt audio for voice cloning', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'prompt.mp3', { type: 'audio/mpeg' })
    
    const response = await client.file.upload(file, 'prompt_audio')
    
    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('prompt_audio')
    expect(response.data.base_resp?.status_code).toBe(0)
    
    console.log('Uploaded prompt audio:', {
      file_id: response.data.file?.file_id,
      filename: response.data.file?.filename
    })
  })

  it('should upload t2a async input file (txt)', async () => {
    const textContent = '这是一个测试文本。\n用于语音合成的异步输入测试。'
    const file = new File([textContent], 'input.txt', { type: 'text/plain' })
    
    const response = await client.file.upload(file, 't2a_async_input')
    
    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('t2a_async_input')
    expect(response.data.base_resp?.status_code).toBe(0)
    
    console.log('Uploaded T2A input file:', {
      file_id: response.data.file?.file_id,
      filename: response.data.file?.filename,
      bytes: response.data.file?.bytes
    })
  })

  it('should list voice clone files', async () => {
    const listResponse = await client.file.list('voice_clone')
    expect(listResponse.data.files).toBeDefined()
    expect(listResponse.data.files.length).toBeGreaterThan(0)
    console.log('Voice clone files count:', listResponse.data.files.length)
  })

  it('should list t2a async input files', async () => {
    const listResponse = await client.file.list('t2a_async_input')
    expect(listResponse.data.files).toBeDefined()
    console.log('T2A async input files count:', listResponse.data.files.length)
  })
})
