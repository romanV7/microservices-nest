import { ValidationError } from '@nestjs/common'
import { ErrorTypeEnum } from '../../modules/users/constants'

interface CreateError {
  readonly message: ErrorTypeEnum
  readonly property: string
}

export function errorParser(
  errors: ValidationError[],
): Record<string, unknown>[] {
  return errors.map(({ property, constraints, children }) => ({
    property,
    ...(constraints && { validationMessages: Object.values(constraints) }),
    ...(children && children.length && { children: errorParser(children) }),
  }))
}

export const createError = (
  message: ErrorTypeEnum,
  property: string,
): CreateError => ({
  message,
  property,
})
