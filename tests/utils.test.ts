/**
 * Unit tests for utility functions
 */

import { describe, it, expect } from 'vitest'
import {
  arrayBufferToHex,
  hexToArrayBuffer,
  isBrowser,
  isNode,
  delay,
} from '../src/utils'

describe('Utility Functions', () => {
  describe('arrayBufferToHex', () => {
    it('should convert ArrayBuffer to hex string', () => {
      const buffer = new ArrayBuffer(2)
      const view = new Uint8Array(buffer)
      view[0] = 255
      view[1] = 128

      const hex = arrayBufferToHex(buffer)
      expect(hex).toBe('ff80')
    })

    it('should handle empty buffer', () => {
      const buffer = new ArrayBuffer(0)
      const hex = arrayBufferToHex(buffer)
      expect(hex).toBe('')
    })
  })

  describe('hexToArrayBuffer', () => {
    it('should convert hex string to ArrayBuffer', () => {
      const buffer = hexToArrayBuffer('ff80')
      const view = new Uint8Array(buffer)
      
      expect(view[0]).toBe(255)
      expect(view[1]).toBe(128)
    })

    it('should handle empty hex string', () => {
      const buffer = hexToArrayBuffer('')
      expect(buffer.byteLength).toBe(0)
    })
  })

  describe('isBrowser / isNode', () => {
    it('should detect environment correctly', () => {
      const browser = isBrowser()
      const node = isNode()
      
      // At least one should be true
      expect(browser || node).toBe(true)
    })
  })

  describe('delay', () => {
    it('should delay for specified milliseconds', async () => {
      const start = Date.now()
      await delay(100)
      const elapsed = Date.now() - start
      
      // Allow generous tolerance for CI environments
      expect(elapsed).toBeGreaterThanOrEqual(50)
      expect(elapsed).toBeLessThan(500)
    })
  })
})
