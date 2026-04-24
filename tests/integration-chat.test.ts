/**
 * Integration Tests: Text Chat API
 * Run: npm test -- --run tests/integration-chat.test.ts
 */

import { describe, it, expect } from 'vitest'
import { createClient } from '../src/client'

const API_KEY = process.env.MINIMAX_API_KEY || ''

describe('Integration: Text Chat API', () => {
  if (!API_KEY) {
    it('skip test: no API_KEY provided', () => {})
    return
  }

  const client = createClient(API_KEY)

  it('should create completion (OpenAI compatible)', async () => {
    const response = await client.chat.createCompletion({
      model: 'MiniMax-M2.7',
      messages: [
        { role: 'user', content: 'Say "Hello" in Chinese' }
      ],
      max_completion_tokens: 50
    })

    expect(response.data.id).toBeDefined()
    expect(response.data.choices[0].message.content).toBeDefined()
    console.log('Response:', response.data.choices[0].message.content)
  }, 15000)

  it('should create message (Anthropic compatible)', async () => {
    const response = await client.chat.createMessage({
      model: 'MiniMax-M2.7',
      messages: [
        { role: 'user', content: 'What is 2+2?' }
      ],
      max_tokens: 50
    })

    expect(response.data.id).toBeDefined()
    expect(response.data.content).toBeDefined()
    console.log('Response:', response.data.content)
  }, 15000)

  it('should stream completion (OpenAI compatible)', async () => {
    const response = await client.chat.createCompletionStream({
      model: 'MiniMax-M2.7',
      messages: [
        { role: 'user', content: 'Count from 1 to 3' }
      ],
      max_completion_tokens: 50
    })

    expect(response.status).toBe(200)
    console.log('Stream initiated, status:', response.status)
  }, 15000)

  it('should stream message (Anthropic compatible)', async () => {
    const response = await client.chat.createMessageStream({
      model: 'MiniMax-M2.7',
      messages: [
        { role: 'user', content: 'What is AI?' }
      ],
      max_tokens: 100
    })

    expect(response.status).toBe(200)
    console.log('Stream initiated, status:', response.status)
  }, 15000)
})
