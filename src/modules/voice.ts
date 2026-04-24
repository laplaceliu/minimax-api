/**
 * Voice Management API module
 */

import { HttpClient, HttpResponse } from '../core/http'
import {
  VoiceCloneRequest,
  VoiceCloneResponse,
  VoiceDesignRequest,
  VoiceDesignResponse,
  GetVoiceRequest,
  GetVoiceResponse,
  DeleteVoiceRequest,
  DeleteVoiceResponse,
  UploadVoiceAudioResponse,
} from '../types/voice'

/**
 * Voice management module for cloning, design, and listing voices
 */
export class VoiceModule {
  constructor(private http: HttpClient) {}

  /**
   * Clone a voice from audio file
   * @see https://platform.minimaxi.com/docs/api-reference/voice-cloning-clone
   */
  async clone(
    request: VoiceCloneRequest
  ): Promise<HttpResponse<VoiceCloneResponse>> {
    return this.http.post<VoiceCloneResponse>('/v1/voice_clone', request)
  }

  /**
   * Design a new voice
   * @see https://platform.minimaxi.com/docs/api-reference/voice-design-design
   */
  async design(
    request: VoiceDesignRequest
  ): Promise<HttpResponse<VoiceDesignResponse>> {
    return this.http.post<VoiceDesignResponse>('/v1/voice_design', request)
  }

  /**
   * Get list of available voices
   * @see https://platform.minimaxi.com/docs/api-reference/voice-management-get
   */
  async list(
    request: GetVoiceRequest
  ): Promise<HttpResponse<GetVoiceResponse>> {
    return this.http.post<GetVoiceResponse>('/v1/get_voice', request)
  }

  /**
   * Delete a voice
   * @see https://platform.minimaxi.com/docs/api-reference/voice-management-delete
   */
  async delete(
    request: DeleteVoiceRequest
  ): Promise<HttpResponse<DeleteVoiceResponse>> {
    return this.http.post<DeleteVoiceResponse>('/v1/delete_voice', request)
  }

  /**
   * Upload prompt audio for voice cloning
   * @see https://platform.minimaxi.com/docs/api-reference/voice-cloning-uploadprompt
   */
  async uploadPrompt(
    file: File | Blob,
    purpose: string = 'prompt_audio'
  ): Promise<HttpResponse<UploadVoiceAudioResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('purpose', purpose)
    // Voice prompt uses the same /v1/files/upload endpoint
    return this.http.uploadFile<UploadVoiceAudioResponse>('/v1/files/upload', formData)
  }

  /**
   * Upload clone audio for voice cloning
   * @see https://platform.minimaxi.com/docs/api-reference/voice-cloning-uploadcloneaudio
   */
  async uploadClone(
    file: File | Blob,
    purpose: string = 'voice_clone'
  ): Promise<HttpResponse<UploadVoiceAudioResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('purpose', purpose)
    // Voice clone uses the same /v1/files/upload endpoint
    return this.http.uploadFile<UploadVoiceAudioResponse>('/v1/files/upload', formData)
  }
}
