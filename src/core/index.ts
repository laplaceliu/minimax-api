/**
 * Core module exports
 */

export { HttpClient, type RequestOptions, type HttpResponse } from './http'
export { WebSocketClient, type WebSocketEventType, type WebSocketMessage } from './websocket'
export { getAuthHeader, validateApiKey, type AuthOptions } from './auth'
export {
  MiniMaxError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  ServerError,
  parseError,
  type BaseResponse,
} from './errors'
