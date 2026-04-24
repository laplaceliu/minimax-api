/**
 * Unit tests for MiniMax API Client
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MiniMaxClient, createClient } from '../src/client'
import { MiniMaxError, AuthenticationError, RateLimitError } from '../src/core/errors'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('MiniMaxClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createClient', () => {
    it('should create a client with valid API key', () => {
      const client = createClient('test-api-key')
      expect(client).toBeInstanceOf(MiniMaxClient)
    })

    it('should throw error with empty API key', () => {
      expect(() => createClient('')).toThrow()
    })

    it('should throw error with whitespace-only API key', () => {
      expect(() => createClient('   ')).toThrow()
    })
  })

  describe('client initialization', () => {
    it('should initialize all modules', () => {
      const client = createClient('test-api-key')
      expect(client.chat).toBeDefined()
      expect(client.speech).toBeDefined()
      expect(client.voice).toBeDefined()
      expect(client.video).toBeDefined()
      expect(client.image).toBeDefined()
      expect(client.music).toBeDefined()
      expect(client.file).toBeDefined()
    })

    it('should create client with custom base URL', () => {
      const client = createClient('test-api-key', 'https://custom-api.example.com')
      expect(client).toBeInstanceOf(MiniMaxClient)
    })
  })
})

describe('Error Classes', () => {
  it('MiniMaxError should contain status code and message', () => {
    const error = new MiniMaxError('Test error', 500, 'TEST_CODE')
    expect(error.message).toBe('Test error')
    expect(error.statusCode).toBe(500)
    expect(error.code).toBe('TEST_CODE')
  })

  it('AuthenticationError should have correct properties', () => {
    const error = new AuthenticationError('Auth failed')
    expect(error.statusCode).toBe(401)
    expect(error.name).toBe('AuthenticationError')
  })

  it('RateLimitError should have correct properties', () => {
    const error = new RateLimitError('Rate limited')
    expect(error.statusCode).toBe(429)
    expect(error.name).toBe('RateLimitError')
  })
})
