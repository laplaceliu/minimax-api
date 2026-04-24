/**
 * Authentication utilities for MiniMax API
 */

export interface AuthOptions {
  apiKey: string
}

export function getAuthHeader(apiKey: string): string {
  return `Bearer ${apiKey}`
}

export function validateApiKey(apiKey: string): void {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('API key is required')
  }
  if (apiKey.trim().length === 0) {
    throw new Error('API key cannot be empty')
  }
}
