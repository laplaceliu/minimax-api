/**
 * Voice Management API types
 */

import type { LanguageBoost } from './speech'

// Voice Clone Request/Response
export interface VoiceCloneRequest {
  file_id: number
  voice_id: string
  clone_prompt?: ClonePrompt
  text?: string
  model?: string
  language_boost?: LanguageBoost
  need_noise_reduction?: boolean
  need_volume_normalization?: boolean
  aigc_watermark?: boolean
}

export interface ClonePrompt {
  prompt_audio: number
  prompt_text: string
}

export interface VoiceCloneResponse {
  input_sensitive?: {
    type: number
  }
  demo_audio?: string
  base_resp: VoiceCloneBaseResponse
}

export interface VoiceCloneBaseResponse {
  status_code: number
  status_msg: string
}

// Voice Design Request/Response
export interface VoiceDesignRequest {
  prompt: string
  preview_text: string
  voice_id?: string
  aigc_watermark?: boolean
}

export interface VoiceDesignReferenceAudio {
  audio_url?: string
  audio_base64?: string
  prompt_text?: string
}

export interface VoiceDesignResponse {
  voice_id?: string
  trial_audio?: string
  base_resp: VoiceCloneBaseResponse
}

// Voice Generation (T2V) for text-to-voice
export interface VoiceGenerationRequest {
  model: string
  text: string
  voice_setting?: VoiceSetting
  audio_setting?: AudioSetting
  language_boost?: LanguageBoost
}

export interface VoiceGenerationResponse {
  task_id?: string
  file_id?: string
  demo_audio_url?: string
  base_resp: VoiceCloneBaseResponse
}

// Get Voice List Request/Response
export interface GetVoiceRequest {
  voice_type: VoiceType
}

export type VoiceType = 'system' | 'voice_cloning' | 'voice_generation' | 'all'

export interface GetVoiceResponse {
  system_voice?: SystemVoiceInfo[]
  voice_cloning?: VoiceCloningInfo[]
  voice_generation?: VoiceGenerationInfo[]
  base_resp: VoiceCloneBaseResponse
}

export interface SystemVoiceInfo {
  voice_id: string
  voice_name: string
  description: string[]
  created_time?: string
}

export interface VoiceCloningInfo {
  voice_id: string
  description: string[]
  created_time: string
}

export interface VoiceGenerationInfo {
  voice_id: string
  description: string[]
  created_time: string
}

// Delete Voice Request/Response
export interface DeleteVoiceRequest {
  voice_type: 'voice_cloning' | 'voice_generation'
  voice_id: string
}

export interface DeleteVoiceResponse {
  voice_id?: string
  created_time?: string
  base_resp: VoiceCloneBaseResponse
}

// Upload Voice Audio
export interface UploadVoiceAudioResponse {
  file?: {
    file_id: number
    bytes: number
    created_at: number
    filename: string
    purpose: string
  }
  base_resp: VoiceCloneBaseResponse
}

// Voice Settings for synthesis
export interface VoiceSetting {
  voice_id: string
  speed?: number
  vol?: number
  pitch?: number
  emotion?: string
  english_normalization?: boolean
}

// Audio Settings for synthesis
export interface AudioSetting {
  sample_rate?: number
  bitrate?: number
  format?: string
  channel?: number
  force_cbr?: boolean
}
