/**
 * Common types shared across all MiniMax API modules
 */

import { BaseResponse } from '../core/errors'

export type Model =
  | 'MiniMax-M2.7'
  | 'MiniMax-M2.7-highspeed'
  | 'MiniMax-M2.5'
  | 'MiniMax-M2.1'

export type SpeechModel =
  | 'speech-2.8-hd'
  | 'speech-2.8-turbo'
  | 'speech-2.6-hd'
  | 'speech-2.6-turbo'
  | 'speech-02-hd'
  | 'speech-02-turbo'
  | 'speech-01-hd'
  | 'speech-01-turbo'

export type VideoModel =
  | 'MiniMax-Hailuo-2.3'
  | 'MiniMax-Hailuo-02'
  | 'T2V-01-Director'
  | 'T2V-01'

export type ImageModel = 'image-01' | 'image-01-live'

export type MusicModel =
  | 'music-2.6'
  | 'music-cover'
  | 'music-2.6-free'
  | 'music-cover-free'

export interface FileObject {
  file_id: number
  bytes: number
  created_at: number
  filename: string
  purpose: string
}

export interface CommonResponse extends BaseResponse {
  trace_id?: string
}

export type CallbackUrl = string

export interface AIGCWatermark {
  aigc_watermark?: boolean
}

// Re-export speech types (excluding duplicates from voice)
export {
  type VoiceSetting,
  type AudioSetting,
  type SpeechEmotion,
  type AudioSampleRate,
  type AudioBitrate,
  type AudioFormat,
  type PronunciationDict,
  type TimbreWeights,
  type VoiceModify,
  type SoundEffect,
  type LanguageBoost,
  type T2AHttpRequest,
  type T2AStreamOption,
  type T2AHttpResponse,
  type T2AData,
  type T2AExtraInfo,
  type T2ABaseResp,
  type T2AAsyncRequest,
  type T2AAsyncResponse,
  type T2AAsyncQueryResponse,
  type T2AAsyncStatus,
  type T2AWebSocketStartEvent,
  type T2AWebSocketContinueEvent,
  type T2AWebSocketFinishEvent,
  type T2AWebSocketResponse,
  type T2AWebSocketEventType,
} from './speech'

// Re-export chat types
export {
  type ChatMessage,
  type ChatCompletionRequest,
  type ChatCompletionResponse,
  type ChatCompletionChunk,
  type ChatChoice,
  type ChatChoiceChunk,
  type Usage,
  type AnthropicMessageRole,
  type AnthropicMessage,
  type ContentBlock,
  type CreateMessageRequest,
  type CreateMessageResponse,
  type CreateMessageResponse as AnthropicResponse,
  type AnthropicUsage,
  type StreamEvent,
  type StreamEventType,
  type MessageStart,
  type Delta,
} from './chat'

// Re-export video types
export {
  type VideoGenerationRequest,
  type VideoDuration,
  type VideoResolution,
  type VideoGenerationResponse,
  type VideoQueryResponse,
  type VideoProcessStatus,
  type VideoBaseResp,
  type T2VRequest,
  type I2VRequest,
  type S2VRequest,
  type FL2VRequest,
  type SubjectReference,
  type VideoDownloadResponse,
  type VideoFileObject,
} from './video'

// Re-export image types
export {
  type StyleObject,
  type StyleType,
  type AspectRatio,
  type ImageGenerationRequest,
  type ImageGenerationResponse,
  type ImageData,
  type ImageMetadata,
  type ImageBaseResp,
  type T2IRequest,
  type I2IRequest,
  type ImageSubjectReference,
} from './image'

// Re-export music types
export {
  type MusicAudioSetting,
  type MusicGenerationRequest,
  type MusicGenerationResponse,
  type MusicData,
  type MusicExtraInfo,
  type MusicBaseResp,
  type LyricsGenerationRequest,
  type LyricsGenerationResponse,
  type MusicCoverPreprocessRequest,
  type MusicCoverPreprocessResponse,
} from './music'

// Re-export file types
export {
  type FilePurpose,
  type DeleteFilePurpose,
  type UploadFileResponse,
  type ListFilesResponse,
  type RetrieveFileResponse,
  type RetrieveFileContentResponse,
  type DeleteFileRequest,
  type DeleteFileResponse,
} from './file'

// Re-export voice types (excluding duplicates from speech)
export {
  type VoiceCloneRequest,
  type ClonePrompt,
  type VoiceCloneResponse,
  type VoiceCloneBaseResponse,
  type VoiceDesignRequest,
  type VoiceDesignReferenceAudio,
  type VoiceDesignResponse,
  type VoiceGenerationRequest,
  type VoiceGenerationResponse,
  type GetVoiceRequest,
  type VoiceType,
  type GetVoiceResponse,
  type SystemVoiceInfo,
  type VoiceCloningInfo,
  type VoiceGenerationInfo,
  type DeleteVoiceRequest,
  type DeleteVoiceResponse,
  type UploadVoiceAudioResponse,
} from './voice'
