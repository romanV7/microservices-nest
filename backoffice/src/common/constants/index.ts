export * from './role-type'
export * from './status-type'

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
  USER_NOT_REGISTRATED = 'USER_NOT_REGISTRATED',
  USER_ALREADY_EXIST = 'USER_ALREADY_EXIST',
}
