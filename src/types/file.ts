/**
 * File Management API types
 */

export type FilePurpose = 'voice_clone' | 'prompt_audio' | 't2a_async_input'

// Upload File Response
export interface UploadFileResponse {
  file: FileObject
  base_resp: FileBaseResp
}

export interface FileObject {
  file_id: number
  bytes: number
  created_at: number
  filename: string
  purpose: FilePurpose
}

export interface FileBaseResp {
  status_code: number
  status_msg: string
}

// List Files Response
export interface ListFilesResponse {
  files: FileObject[]
  base_resp: FileBaseResp
}

// Retrieve File Response
export interface RetrieveFileResponse {
  file: FileObject
  base_resp: FileBaseResp
}

// Retrieve File Content Response
export interface RetrieveFileContentResponse {
  file_id: number
  content_type: string
  content: ArrayBuffer
  base_resp: FileBaseResp
}

// Delete File Response
export interface DeleteFileResponse {
  base_resp: FileBaseResp
}
