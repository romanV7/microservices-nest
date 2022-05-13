import { registerDecorator, ValidationOptions } from 'class-validator'
import { StreamOutboundUrlConstraint } from '../constraints'

export function StreamOutboundUrl<T>(
  validationOptions?: ValidationOptions,
): (object: T, propertyName: string) => void {
  return (object: T, propertyName: string): void => {
    registerDecorator({
      name: 'StreamOutboundUrl',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: StreamOutboundUrlConstraint,
    })
  }
}
