/**
 * MiniMax API JavaScript/TypeScript SDK
 * 
 * @example
 * ```typescript
 * import { createClient } from 'minimax-api'
 * 
 * const client = createClient('your-api-key')
 * 
 * // Chat completion
 * const response = await client.chat.createCompletion({
 *   model: 'MiniMax-M2.7',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * })
 * 
 * // Text-to-speech
 * const audio = await client.speech.synthesize({
 *   model: 'speech-2.8-hd',
 *   text: 'Hello, world!',
 *   voice_setting: { voice_id: 'male-qn-qingse' }
 * })
 * ```
 */

export { MiniMaxClient, createClient, type MiniMaxClientOptions } from './client'
export * from './modules'
export * from './types'
export * from './core'
