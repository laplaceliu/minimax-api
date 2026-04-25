/**
 * Video Generation API types
 */

// Video Generation Request
export interface VideoGenerationRequest {
  model: string
  prompt: string
  prompt_optimizer?: boolean
  fast_pretreatment?: boolean
  duration?: VideoDuration
  resolution?: VideoResolution
  callback_url?: string
  aigc_watermark?: boolean
}

export type VideoDuration = 6 | 10

export type VideoResolution = '720P' | '768P' | '1080P'

// Video Generation Response
export interface VideoGenerationResponse {
  task_id: string
  base_resp: VideoBaseResp
}

// Video Query Response
export interface VideoQueryResponse {
  task_id: string
  status: VideoProcessStatus
  file_id?: string
  video_width?: number
  video_height?: number
  base_resp: VideoBaseResp
}

export type VideoProcessStatus = 'Preparing' | 'Queueing' | 'Processing' | 'Success' | 'Fail'

export interface VideoBaseResp {
  status_code: number
  status_msg: string
}

// Subject Reference for S2V
export interface SubjectReference {
  type: 'character'
  image: string[]
}

// Text-to-Video (T2V)
export interface T2VRequest extends VideoGenerationRequest {}

// Image-to-Video (I2V)
export interface I2VRequest extends VideoGenerationRequest {
  first_frame_image: string
}

// Subject-to-Video (S2V) - subject consistency video
export interface S2VRequest extends VideoGenerationRequest {
  subject_reference: SubjectReference[]
}

// First Letter Video (FL2V) - first letter consistency video
export interface FL2VRequest extends VideoGenerationRequest {
  first_frame_image?: string
  last_frame_image: string
}

// Video Download Response
export interface VideoDownloadResponse {
  file: VideoFileObject
  base_resp: VideoBaseResp
}

export interface VideoFileObject {
  file_id: number
  bytes: number
  created_at: number
  filename: string
  purpose: string
  download_url?: string
}
