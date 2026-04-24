/**
 * MiniMax API Error types
 */

export class MiniMaxError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'MiniMaxError'
  }
}

export class AuthenticationError extends MiniMaxError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 401, 'AUTHENTICATION_ERROR', details)
    this.name = 'AuthenticationError'
  }
}

export class RateLimitError extends MiniMaxError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 429, 'RATE_LIMIT_ERROR', details)
    this.name = 'RateLimitError'
  }
}

export class ValidationError extends MiniMaxError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends MiniMaxError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 404, 'NOT_FOUND_ERROR', details)
    this.name = 'NotFoundError'
  }
}

export class ServerError extends MiniMaxError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 500, 'SERVER_ERROR', details)
    this.name = 'ServerError'
  }
}

export interface BaseResponse {
  status_code: number
  status_msg: string
}

export function parseError(response: BaseResponse): MiniMaxError {
  const { status_code, status_msg } = response

  switch (status_code) {
    case 0:
      return new MiniMaxError(status_msg)
    case 1000:
      return new MiniMaxError(`Unknown error: ${status_msg}`, 500, 'UNKNOWN_ERROR')
    case 1001:
      return new MiniMaxError(`Request timeout: ${status_msg}`, 408, 'TIMEOUT')
    case 1002:
      return new RateLimitError(`Rate limit exceeded: ${status_msg}`)
    case 1004:
      return new AuthenticationError(`Authentication failed: ${status_msg}`)
    case 1008:
      return new MiniMaxError(`Insufficient balance: ${status_msg}`, 402, 'INSUFFICIENT_BALANCE')
    case 1013:
      return new ServerError(`Internal server error: ${status_msg}`)
    case 1026:
      return new ValidationError(`Content policy violation: ${status_msg}`)
    case 1027:
      return new MiniMaxError(`Output content error: ${status_msg}`, undefined, 'OUTPUT_ERROR')
    case 1039:
      return new RateLimitError(`Token limit exceeded (TPM): ${status_msg}`)
    case 2013:
      return new ValidationError(`Invalid parameters: ${status_msg}`)
    case 2038:
      return new MiniMaxError(`No voice cloning permission: ${status_msg}`, 403, 'NO_PERMISSION')
    default:
      return new MiniMaxError(`Error ${status_code}: ${status_msg}`, undefined, 'UNKNOWN_ERROR_CODE')
  }
}
