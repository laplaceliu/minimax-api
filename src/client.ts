/**
 * MiniMax API Client
 * Main entry point for all MiniMax API operations
 */

import { validateApiKey } from './core/auth'
import { HttpClient } from './core/http'
import { MiniMaxError } from './core/errors'
import {
  ChatModule,
  SpeechModule,
  VoiceModule,
  VideoModule,
  ImageModule,
  MusicModule,
  FileModule,
} from './modules'

export interface MiniMaxClientOptions {
  apiKey: string
  baseURL?: string
  timeout?: number
}

export class MiniMaxClient {
  public readonly chat: ChatModule
  public readonly speech: SpeechModule
  public readonly voice: VoiceModule
  public readonly video: VideoModule
  public readonly image: ImageModule
  public readonly music: MusicModule
  public readonly file: FileModule

  private http: HttpClient

  constructor(options: MiniMaxClientOptions) {
    if (!options.apiKey) {
      throw new MiniMaxError('API key is required', undefined, 'MISSING_API_KEY')
    }

    validateApiKey(options.apiKey)

    this.http = new HttpClient(options.apiKey, options.baseURL, options.timeout)

    // Initialize all modules
    this.chat = new ChatModule(this.http)
    this.speech = new SpeechModule(this.http, options.apiKey)
    this.voice = new VoiceModule(this.http)
    this.video = new VideoModule(this.http)
    this.image = new ImageModule(this.http)
    this.music = new MusicModule(this.http)
    this.file = new FileModule(this.http)
  }

  /**
   * Create a new MiniMax client instance
   */
  static create(options: MiniMaxClientOptions): MiniMaxClient {
    return new MiniMaxClient(options)
  }
}

/**
 * Create a MiniMax client with the given API key
 */
export function createClient(apiKey: string, baseURL?: string): MiniMaxClient {
  return new MiniMaxClient({ apiKey, baseURL })
}

// Re-export everything from modules and types
export * from './modules'
export * from './types'
export * from './core'
