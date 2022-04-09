export * from './role-type'
export * from './status-type'
export * from './stream-status'
export * from './stream-type'

export enum MailerMessages {
  Register = 'Email confirmation',
  ResetPassword = 'Reset password',
}

export enum ResponseErrorTypeEnum {
  SCHEMA_VALIDATION_ERROR = 'SchemaValidationError',
}

export enum ErrorTypeEnum {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_JWT_TOKEN = 'INVALID_JWT_TOKEN',
  INVALID_CONFIRMATION_CODE = 'INVALID_CONFIRMATION_CODE',
  USER_NOT_REGISTERED = 'USER_NOT_REGISTERED',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_INVALID_PASSWORD = 'USER_INVALID_PASSWORD',
  USER_NOT_LOGGED_IN = 'USER_NOT_LOGGED_IN',
  TOKEN_BLACKLISTED = 'TOKEN_BLACKLISTED',
  TRANSITION_NOT_ALLOWED = 'TRANSITION_NOT_ALLOWED',
  STREAM_NOT_FOUND = 'STREAM_NOT_FOUND',
  UPDATE_STREAM = 'UPDATE_STREAM',
  AXIOS_ERROR = 'AXIOS_ERROR',
  COMPLETE_STREAM = 'COMPLETE_STREAM',
  START_STREAM = 'START_STREAM',
  STOP_STREAM = 'STOP_STREAM',
  DEACTIVATING_STREAM = 'DEACTIVATING_STREAM',
  INITIATE_STREAM = 'INITIATE_STREAM',
  DEACTIVATE_COMPELTE_STREAM = 'DEACTIVATE_COMPELTE_STREAM',
}

export enum CommonErrors {
  UNAUTHORIZED = 'Unauthorized',
}

export const StreamProviderUrls = {
  create: '/api/v1/droplets/create',
  delete: '/api/v1/droplets/delete',
}
