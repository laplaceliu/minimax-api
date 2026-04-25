/**
 * Image Generation API types
 */

// Style Object
export interface StyleObject {
  style_type: StyleType
  style_weight?: number
}

export type StyleType = '漫画' | '元气' | '中世纪' | '水彩'

// Image Generation Request
export interface ImageGenerationRequest {
  model: string
  prompt: string
  style?: StyleObject
  aspect_ratio?: AspectRatio
  width?: number
  height?: number
  response_format?: 'url' | 'base64'
  seed?: number
  n?: number
  prompt_optimizer?: boolean
  aigc_watermark?: boolean
}

export type AspectRatio = '1:1' | '16:9' | '4:3' | '3:2' | '2:3' | '3:4' | '9:16' | '21:9'

// Image Generation Response
export interface ImageGenerationResponse {
  id: string
  data: ImageData
  metadata?: ImageMetadata
  base_resp: ImageBaseResp
}

export interface ImageData {
  image_urls?: string[]
  image_base64?: string[]
}

export interface ImageMetadata {
  success_count: number
  failed_count: number
}

export interface ImageBaseResp {
  status_code: number
  status_msg: string
}

// Text-to-Image (T2I)
export interface T2IRequest extends ImageGenerationRequest {}

// Image Subject Reference for I2I
export interface ImageSubjectReference {
  type: 'character'
  image_file: string
}

// Image-to-Image (I2I)
export interface I2IRequest extends ImageGenerationRequest {
  subject_reference?: ImageSubjectReference[]
}
