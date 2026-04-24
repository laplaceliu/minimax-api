/**
 * Chat API types
 */

// OpenAI Compatible API types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'user_system' | 'group' | 'sample_message_user' | 'sample_message_ai'
  name?: string
  content: string
}

export interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  stream?: boolean
  max_completion_tokens?: number
  temperature?: number
  top_p?: number
}

export interface ChatCompletionResponse {
  id: string
  choices: ChatChoice[]
  created: number
  model: string
  object: 'chat.completion'
  usage?: Usage
  input_sensitive?: boolean
  output_sensitive?: boolean
  input_sensitive_type?: number
  output_sensitive_type?: number
  base_resp?: BaseResp
}

export interface ChatCompletionChunk {
  id: string
  choices: ChatChoiceChunk[]
  created: number
  model: string
  object: 'chat.completion.chunk'
  usage?: Usage
  input_sensitive?: boolean
  output_sensitive?: boolean
  input_sensitive_type?: number
  output_sensitive_type?: number
}

export interface ChatChoice {
  finish_reason: 'stop' | 'length'
  index: number
  message: {
    content: string
    role: 'assistant'
  }
}

export interface ChatChoiceChunk {
  index: number
  delta: {
    role?: 'assistant'
    content?: string
  }
  finish_reason?: 'stop' | 'length' | null
}

export interface Usage {
  total_tokens: number
  total_characters?: number
  prompt_tokens?: number
  completion_tokens?: number
  prompt_tokens_details?: {
    cached_tokens: number
  }
}

// Anthropic Compatible API types
export type AnthropicMessageRole = 'user' | 'assistant' | 'user_system' | 'group' | 'sample_message_user' | 'sample_message_ai'

export interface AnthropicMessage {
  role: AnthropicMessageRole
  content: string | ContentBlock[]
}

export interface ContentBlock {
  type: 'text' | 'thinking'
  text?: string
  thinking?: string
  signature?: string
}

export interface CreateMessageRequest {
  model: string
  messages: AnthropicMessage[]
  stream?: boolean
  max_tokens?: number
  temperature?: number
  top_p?: number
  system?: string | ContentBlock[]
}

export interface CreateMessageResponse {
  id: string
  type: 'message'
  role: 'assistant'
  model: string
  content: ContentBlock[]
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence'
  usage: AnthropicUsage
  base_resp?: BaseResp
}

export interface AnthropicUsage {
  input_tokens: number
  output_tokens: number
}

export interface StreamEvent {
  type: StreamEventType
  message?: MessageStart
  index?: number
  content_block?: ContentBlock
  delta?: Delta
  usage?: AnthropicUsage
}

export type StreamEventType = 
  | 'message_start'
  | 'ping'
  | 'content_block_start'
  | 'content_block_delta'
  | 'content_block_stop'
  | 'message_delta'
  | 'message_stop'

export interface MessageStart {
  id: string
  type: 'message'
  role: 'assistant'
  content: ContentBlock[]
  model: string
  stop_reason: string | null
  stop_sequence: string | null
  usage: AnthropicUsage
  service_tier?: string
}

export interface Delta {
  type?: string
  text?: string
  thinking?: string
  signature?: string
  stop_reason?: string
}

interface BaseResp {
  status_code: number
  status_msg: string
}
