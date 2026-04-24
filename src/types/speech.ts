/**
 * Speech (T2A) API types
 */

// Voice Settings
export interface VoiceSetting {
  voice_id: string
  speed?: number
  vol?: number
  pitch?: number
  emotion?: SpeechEmotion
  english_normalization?: boolean
}

export type SpeechEmotion = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'fearful' 
  | 'disgusted' 
  | 'surprised' 
  | 'calm' 
  | 'fluent' 
  | 'whisper'

// Audio Settings
export interface AudioSetting {
  sample_rate?: AudioSampleRate
  bitrate?: AudioBitrate
  format?: AudioFormat
  channel?: 1 | 2
  force_cbr?: boolean
}

export type AudioSampleRate = 8000 | 16000 | 22050 | 24000 | 32000 | 44100
export type AudioBitrate = 32000 | 64000 | 128000 | 256000
export type AudioFormat = 'mp3' | 'pcm' | 'flac' | 'wav'

// Pronunciation Dictionary
export interface PronunciationDict {
  tone: string[]
}

// Timbre Weights for voice mixing
export interface TimbreWeights {
  voice_id: string
  weight: number
}

// Voice Modify (Sound Effects)
export interface VoiceModify {
  pitch?: number
  intensity?: number
  timbre?: number
  sound_effects?: SoundEffect
}

export type SoundEffect = 'spacious_echo' | 'auditorium_echo' | 'lofi_telephone' | 'robotic'

// Language Boost
export type LanguageBoost = 
  | 'Chinese' 
  | 'Chinese,Yue' 
  | 'English' 
  | 'Arabic' 
  | 'Russian' 
  | 'Spanish' 
  | 'French' 
  | 'Portuguese' 
  | 'German' 
  | 'Turkish' 
  | 'Dutch' 
  | 'Ukrainian' 
  | 'Vietnamese' 
  | 'Indonesian' 
  | 'Japanese' 
  | 'Italian' 
  | 'Korean' 
  | 'Thai' 
  | 'Polish' 
  | 'Romanian' 
  | 'Greek' 
  | 'Czech' 
  | 'Finnish' 
  | 'Hindi' 
  | 'Bulgarian' 
  | 'Danish' 
  | 'Hebrew' 
  | 'Malay' 
  | 'Persian' 
  | 'Slovak' 
  | 'Swedish' 
  | 'Croatian' 
  | 'Filipino' 
  | 'Hungarian' 
  | 'Norwegian' 
  | 'Slovenian' 
  | 'Catalan' 
  | 'Nynorsk' 
  | 'Tamil' 
  | 'Afrikaans' 
  | 'auto'

// Synchronous T2A HTTP Request/Response
export interface T2AHttpRequest {
  model: string
  text: string
  stream?: boolean
  stream_options?: T2AStreamOption
  voice_setting: VoiceSetting
  audio_setting?: AudioSetting
  pronunciation_dict?: PronunciationDict
  timbre_weights?: TimbreWeights[]
  language_boost?: LanguageBoost
  voice_modify?: VoiceModify
  subtitle_enable?: boolean
  output_format?: 'url' | 'hex'
  aigc_watermark?: boolean
}

export interface T2AStreamOption {
  exclude_aggregated_audio?: boolean
}

export interface T2AHttpResponse {
  data: T2AData | null
  trace_id: string
  extra_info?: T2AExtraInfo
  base_resp: T2ABaseResp
}

export interface T2AData {
  audio: string
  subtitle_file?: string
  status: 1 | 2
}

export interface T2AExtraInfo {
  audio_length: number
  audio_sample_rate: number
  audio_size: number
  bitrate: number
  audio_format: AudioFormat
  audio_channel: 1 | 2
  invisible_character_ratio: number
  usage_characters: number
  word_count: number
}

export interface T2ABaseResp {
  status_code: number
  status_msg: string
}

// Async T2A Request/Response
export interface T2AAsyncRequest {
  model: string
  text?: string
  text_file_id?: number
  voice_setting: {
    voice_id: string
    speed?: number
    vol?: number
    pitch?: number
    emotion?: SpeechEmotion
    english_normalization?: boolean
  }
  audio_setting?: {
    audio_sample_rate?: AudioSampleRate
    bitrate?: AudioBitrate
    format?: 'mp3' | 'pcm' | 'flac'
    channel?: 1 | 2
  }
  pronunciation_dict?: PronunciationDict
  language_boost?: LanguageBoost
  voice_modify?: VoiceModify
  aigc_watermark?: boolean
}

export interface T2AAsyncResponse {
  task_id: string
  file_id?: number
  task_token?: string
  usage_characters?: number
  base_resp: T2ABaseResp
}

// Async T2A Query
export interface T2AAsyncQueryResponse {
  task_id: string
  status: T2AAsyncStatus
  file_id?: number
  aigc_watermark_status?: string
  base_resp: T2ABaseResp
}

export type T2AAsyncStatus = 'Pending' | 'Processing' | 'Success' | 'Failed'

// WebSocket T2A Events
export interface T2AWebSocketStartEvent {
  event: 'task_start'
  model: string
  voice_setting: VoiceSetting
  text?: string
  audio_setting?: AudioSetting
  pronunciation_dict?: PronunciationDict
  timbre_weights?: TimbreWeights[]
  language_boost?: LanguageBoost
  voice_modify?: VoiceModify
  output_format?: 'url' | 'hex'
}

export interface T2AWebSocketContinueEvent {
  event: 'task_continue'
  text?: string
}

export interface T2AWebSocketFinishEvent {
  event: 'task_finish'
}

export interface T2AWebSocketResponse {
  event: T2AWebSocketEventType
  data?: unknown
  trace_id?: string
  extra_info?: T2AExtraInfo
  base_resp?: T2ABaseResp
}

export type T2AWebSocketEventType = 
  | 'task_started'
  | 'task_continued'
  | 'task_finished'
  | 'audio_generated'
  | 'error'
