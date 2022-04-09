import { registerDecorator, ValidationOptions } from 'class-validator'
import { StreamArchieveUrlConstraint } from '../constraints'

export function StreamArchieveUrl<T>(
  validationOptions?: ValidationOptions,
): (object: T, propertyName: string) => void {
  return (object: T, propertyName: string): void => {
    registerDecorator({
      name: 'StreamArchieveUrl',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: StreamArchieveUrlConstraint,
    })
  }
}
