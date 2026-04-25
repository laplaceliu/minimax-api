/**
 * Music Generation API types
 */

// Audio Setting for Music
export interface MusicAudioSetting {
  sample_rate?: 16000 | 24000 | 32000 | 44100
  bitrate?: 32000 | 64000 | 128000 | 256000
  format?: 'mp3' | 'wav' | 'pcm'
}

// Music Generation Request
export interface MusicGenerationRequest {
  model: string
  prompt?: string
  lyrics?: string
  stream?: boolean
  output_format?: 'url' | 'hex'
  audio_setting?: MusicAudioSetting
  aigc_watermark?: boolean
  lyrics_optimizer?: boolean
  is_instrumental?: boolean
  audio_url?: string
  audio_base64?: string
  cover_feature_id?: string
}

// Music Generation Response
export interface MusicGenerationResponse {
  data?: MusicData
  trace_id?: string
  extra_info?: MusicExtraInfo
  analysis_info?: unknown
  base_resp: MusicBaseResp
}

export interface MusicData {
  status: 1 | 2
  audio?: string
}

export interface MusicExtraInfo {
  music_duration?: number
  music_sample_rate?: number
  music_channel?: number
  bitrate?: number
  music_size?: number
}

export interface MusicBaseResp {
  status_code: number
  status_msg: string
}

// Lyrics Generation Request/Response
export interface LyricsGenerationRequest {
  mode: 'write_full_song' | 'edit'
  prompt?: string
  lyrics?: string
  title?: string
}

export interface LyricsGenerationResponse {
  song_title?: string
  style_tags?: string
  lyrics?: string
  base_resp: MusicBaseResp
}

// Music Cover Preprocess Request/Response
export interface MusicCoverPreprocessRequest {
  model: 'music-cover'
  audio_url?: string
  audio_base64?: string
}

export interface MusicCoverPreprocessResponse {
  cover_feature_id: string
  formatted_lyrics?: string
  structure_result?: string
  audio_duration?: number
  trace_id?: string
  base_resp: MusicBaseResp
}
