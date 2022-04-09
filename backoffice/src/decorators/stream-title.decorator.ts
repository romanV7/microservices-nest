import { registerDecorator, ValidationOptions } from 'class-validator'
import { StreamTitleConstraint } from '../constraints/stream-title.constraint'

export function StreamTitle<T>(
  validationOptions?: ValidationOptions,
): (object: T, propertyName: string) => void {
  return (object: T, propertyName: string): void => {
    registerDecorator({
      name: 'StreamTitle',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: StreamTitleConstraint,
    })
  }
}
