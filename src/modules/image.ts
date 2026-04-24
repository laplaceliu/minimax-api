/**
 * Image Generation API module
 */

import { HttpClient, HttpResponse } from '../core/http'
import {
  ImageGenerationResponse,
  T2IRequest,
  I2IRequest,
} from '../types/image'

/**
 * Image generation module
 */
export class ImageModule {
  constructor(private http: HttpClient) {}

  /**
   * Generate image from text (Text-to-Image)
   * @see https://platform.minimaxi.com/docs/api-reference/image-generation-t2i
   */
  async generateFromText(
    request: T2IRequest
  ): Promise<HttpResponse<ImageGenerationResponse>> {
    return this.http.post<ImageGenerationResponse>('/v1/image_generation', request)
  }

  /**
   * Generate image from image (Image-to-Image)
   * @see https://platform.minimaxi.com/docs/api-reference/image-generation-i2i
   */
  async generateFromImage(
    request: I2IRequest
  ): Promise<HttpResponse<ImageGenerationResponse>> {
    return this.http.post<ImageGenerationResponse>('/v1/image_generation', request)
  }

  /**
   * Generate image (unified interface)
   * Automatically detects request type based on presence of image_url or image_base64
   */
  async generate(
    request: T2IRequest | I2IRequest
  ): Promise<HttpResponse<ImageGenerationResponse>> {
    return this.http.post<ImageGenerationResponse>('/v1/image_generation', request)
  }
}
