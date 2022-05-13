import { registerDecorator, ValidationOptions } from 'class-validator'
import { StreamInboundUrlConstraint } from '../constraints'

export function StreamInboundUrl<T>(
  validationOptions?: ValidationOptions,
): (object: T, propertyName: string) => void {
  return (object: T, propertyName: string): void => {
    registerDecorator({
      name: 'StreamInboundUrl',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: StreamInboundUrlConstraint,
    })
  }
}
