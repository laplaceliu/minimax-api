/**
 * File Management API module
 */

import { HttpClient, HttpResponse } from '../core/http'
import {
  UploadFileResponse,
  ListFilesResponse,
  RetrieveFileResponse,
  RetrieveFileContentResponse,
  DeleteFileResponse,
  FilePurpose,
  DeleteFilePurpose,
} from '../types/file'

/**
 * File management module for uploading, listing, and managing files
 */
export class FileModule {
  constructor(private http: HttpClient) {}

  /**
   * Upload a file
   * @see https://platform.minimaxi.com/docs/api-reference/file-management-upload
   */
  async upload(
    file: File | Blob,
    purpose: FilePurpose
  ): Promise<HttpResponse<UploadFileResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('purpose', purpose)
    return this.http.uploadFile<UploadFileResponse>('/v1/files/upload', formData)
  }

  /**
   * Upload a file from path (Node.js only)
   * @param filePath - Path to the file (Node.js only)
   * @param purpose - File purpose
   * @throws Error - This method is only available in Node.js environment
   */
  async uploadFromPath(
    _filePath: string,
    _purpose: FilePurpose
  ): Promise<HttpResponse<UploadFileResponse>> {
    // This will be handled by the client based on environment
    // In Node.js, you would use fs.createReadStream
    // This is a placeholder that will be implemented in the client
    throw new Error('uploadFromPath is only available in Node.js environment')
  }

  /**
   * List files by purpose
   * @see https://platform.minimaxi.com/docs/api-reference/file-management-list
   */
  async list(
    purpose: FilePurpose
  ): Promise<HttpResponse<ListFilesResponse>> {
    return this.http.get<ListFilesResponse>(`/v1/files/list?purpose=${purpose}`)
  }

  /**
   * Retrieve file information
   * @see https://platform.minimaxi.com/docs/api-reference/file-management-retrieve
   */
  async retrieve(
    fileId: string | number
  ): Promise<HttpResponse<RetrieveFileResponse>> {
    return this.http.get<RetrieveFileResponse>(`/v1/files/retrieve?file_id=${fileId}`)
  }

  /**
   * Retrieve file content
   * @see https://platform.minimaxi.com/docs/api-reference/file-management-retrieve-content
   */
  async retrieveContent(
    fileId: string | number
  ): Promise<HttpResponse<RetrieveFileContentResponse>> {
    return this.http.get<RetrieveFileContentResponse>(`/v1/files/retrieve_content?file_id=${fileId}`)
  }

  /**
   * Delete a file
   * @see https://platform.minimaxi.com/docs/api-reference/file-management-delete
   */
  async delete(
    fileId: string | number,
    purpose: DeleteFilePurpose
  ): Promise<HttpResponse<DeleteFileResponse>> {
    return this.http.post<DeleteFileResponse>('/v1/files/delete', {
      file_id: fileId,
      purpose,
    })
  }
}
