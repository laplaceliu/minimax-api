/**
 * Integration Tests: File Management API
 * Run: npm test -- --run tests/integration-file.test.ts
 */

import { describe, it, expect } from 'vitest'
import { createClient } from '../src/client'
import * as fs from 'fs'
import * as path from 'path'

const API_KEY = process.env.MINIMAX_API_KEY || ''
const MISC_DIR = path.join(__dirname, '..', 'misc')

describe('Integration: File Management API', () => {
  if (!API_KEY) {
    it('skip test: no API_KEY provided', () => {})
    return
  }

  const client = createClient(API_KEY)

  it('should upload voice clone file', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'minimax-api-test.mp3', { type: 'audio/mpeg' })

    const response = await client.file.upload(file, 'voice_clone')

    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('voice_clone')
    expect(response.data.base_resp?.status_code).toBe(0)
    console.log('File:', {
      id: response.data.file?.file_id,
      name: response.data.file?.filename,
      bytes: response.data.file?.bytes
    })
  })

  it('should upload prompt audio file', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'prompt.mp3', { type: 'audio/mpeg' })

    const response = await client.file.upload(file, 'prompt_audio')

    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('prompt_audio')
    expect(response.data.base_resp?.status_code).toBe(0)
    console.log('Prompt file ID:', response.data.file?.file_id)
  })

  it('should upload T2A async input file', async () => {
    const content = '这是一个测试文本。\n用于语音合成测试。'
    const file = new File([content], 'input.txt', { type: 'text/plain' })

    const response = await client.file.upload(file, 't2a_async_input')

    expect(response.data.file).toBeDefined()
    expect(response.data.file?.file_id).toBeDefined()
    expect(response.data.file?.purpose).toBe('t2a_async_input')
    expect(response.data.base_resp?.status_code).toBe(0)
    console.log('T2A input file ID:', response.data.file?.file_id)
  })

  it('should list voice clone files', async () => {
    const response = await client.file.list('voice_clone')

    expect(response.data.files).toBeDefined()
    expect(response.data.base_resp?.status_code).toBe(0)
    console.log('Voice clone files count:', response.data.files.length)
  })

  it('should list T2A async files', async () => {
    const response = await client.file.list('t2a_async_input')

    expect(response.data.files).toBeDefined()
    expect(response.data.base_resp?.status_code).toBe(0)
    console.log('T2A async files count:', response.data.files.length)
  })

  it('should retrieve file', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'retrieve_test.mp3', { type: 'audio/mpeg' })

    const uploadResponse = await client.file.upload(file, 'voice_clone')
    const fileId = uploadResponse.data.file?.file_id

    const retrieveResponse = await client.file.retrieve(String(fileId))

    expect(retrieveResponse.data.file).toBeDefined()
    expect(retrieveResponse.data.file?.file_id).toBe(fileId)
    expect(retrieveResponse.data.base_resp?.status_code).toBe(0)
    console.log('Retrieved file:', retrieveResponse.data.file?.filename)
  })

  it('should delete file', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'delete_test.mp3', { type: 'audio/mpeg' })

    const uploadResponse = await client.file.upload(file, 'voice_clone')
    const fileId = uploadResponse.data.file?.file_id

    const deleteResponse = await client.file.delete(String(fileId))

    expect(deleteResponse.data.base_resp).toBeDefined()
    expect(deleteResponse.data.base_resp?.status_code).toBe(0)
    console.log('Delete status:', deleteResponse.data.base_resp?.status_msg)
  })

  it('should retrieve file content', async () => {
    const filePath = path.join(MISC_DIR, 'minimax-api-test.mp3')
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'content_test.mp3', { type: 'audio/mpeg' })

    const uploadResponse = await client.file.upload(file, 'voice_clone')
    const fileId = uploadResponse.data.file?.file_id

    const contentResponse = await client.file.retrieveContent(String(fileId))

    expect(contentResponse.data.file_id).toBeDefined()
    expect(contentResponse.data.content).toBeDefined()
    console.log('Content retrieved, length:', contentResponse.data.content.byteLength)
  })
})
