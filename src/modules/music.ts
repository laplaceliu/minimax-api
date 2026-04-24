/**
 * Music Generation API module
 */

import { HttpClient, HttpResponse } from '../core/http'
import {
  MusicGenerationRequest,
  MusicGenerationResponse,
  LyricsGenerationRequest,
  LyricsGenerationResponse,
  MusicCoverPreprocessRequest,
  MusicCoverPreprocessResponse,
} from '../types/music'

/**
 * Music generation module
 */
export class MusicModule {
  constructor(private http: HttpClient) {}

  /**
   * Generate music from lyrics and prompt
   * @see https://platform.minimaxi.com/docs/api-reference/music-generation
   */
  async generate(
    request: MusicGenerationRequest
  ): Promise<HttpResponse<MusicGenerationResponse>> {
    return this.http.post<MusicGenerationResponse>('/v1/music_generation', request)
  }

  /**
   * Generate music with streaming
   */
  async generateStream(
    request: MusicGenerationRequest
  ): Promise<HttpResponse<MusicGenerationResponse>> {
    return this.http.post<MusicGenerationResponse>('/v1/music_generation', {
      ...request,
      stream: true,
    })
  }

  /**
   * Generate lyrics from prompt
   * @see https://platform.minimaxi.com/docs/api-reference/lyrics-generation
   */
  async generateLyrics(
    request: LyricsGenerationRequest
  ): Promise<HttpResponse<LyricsGenerationResponse>> {
    return this.http.post<LyricsGenerationResponse>('/v1/lyrics_generation', request)
  }

  /**
   * Preprocess audio for music cover
   * @see https://platform.minimaxi.com/docs/api-reference/music-cover-preprocess
   */
  async preprocessCover(
    request: MusicCoverPreprocessRequest
  ): Promise<HttpResponse<MusicCoverPreprocessResponse>> {
    return this.http.post<MusicCoverPreprocessResponse>('/v1/music_cover_preprocess', request)
  }
}
