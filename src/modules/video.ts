/**
 * Video Generation API module
 */

import { HttpClient, HttpResponse } from '../core/http'
import {
  VideoGenerationResponse,
  VideoQueryResponse,
  VideoDownloadResponse,
  T2VRequest,
  I2VRequest,
  S2VRequest,
  FL2VRequest,
} from '../types/video'

/**
 * Video generation module
 */
export class VideoModule {
  constructor(private http: HttpClient) {}

  /**
   * Generate video from text (Text-to-Video)
   * @see https://platform.minimaxi.com/docs/api-reference/video-generation-t2v
   */
  async generateFromText(
    request: T2VRequest
  ): Promise<HttpResponse<VideoGenerationResponse>> {
    return this.http.post<VideoGenerationResponse>('/v1/video_generation', request)
  }

  /**
   * Generate video from image (Image-to-Video)
   * @see https://platform.minimaxi.com/docs/api-reference/video-generation-i2v
   */
  async generateFromImage(
    request: I2VRequest
  ): Promise<HttpResponse<VideoGenerationResponse>> {
    return this.http.post<VideoGenerationResponse>('/v1/video_generation', {
      ...request,
      model: request.model || 'MiniMax-Hailuo-02',
    })
  }

  /**
   * Generate video with subject consistency (Subject-to-Video)
   * @see https://platform.minimaxi.com/docs/api-reference/video-generation-s2v
   */
  async generateSubjectVideo(
    request: S2VRequest
  ): Promise<HttpResponse<VideoGenerationResponse>> {
    return this.http.post<VideoGenerationResponse>('/v1/video_generation', request)
  }

  /**
   * Generate video with first letter consistency (FL2V)
   * @see https://platform.minimaxi.com/docs/api-reference/video-generation-fl2v
   */
  async generateFirstLetterVideo(
    request: FL2VRequest
  ): Promise<HttpResponse<VideoGenerationResponse>> {
    return this.http.post<VideoGenerationResponse>('/v1/video_generation', request)
  }

  /**
   * Query video generation task status
   * @see https://platform.minimaxi.com/docs/api-reference/video-generation-query
   */
  async query(
    taskId: string
  ): Promise<HttpResponse<VideoQueryResponse>> {
    return this.http.get<VideoQueryResponse>(`/v1/query/video_generation?task_id=${taskId}`)
  }

  /**
   * Download video file
   * @see https://platform.minimaxi.com/docs/api-reference/video-generation-download
   */
  async download(
    fileId: string
  ): Promise<HttpResponse<VideoDownloadResponse>> {
    return this.http.get<VideoDownloadResponse>(`/v1/files/retrieve?file_id=${fileId}`)
  }
}
