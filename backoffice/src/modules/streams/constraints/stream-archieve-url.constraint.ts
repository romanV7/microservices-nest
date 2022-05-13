import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { messages } from '../../../common'

@ValidatorConstraint({ name: 'StreamArchieveUrl', async: true })
@Injectable()
export class StreamArchieveUrlConstraint
  implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    if (!value) {
      return true
    }

    return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
      value,
    )
  }

  defaultMessage(args: ValidationArguments): string {
    return messages.errors.invalidStreamArchieveUrl
  }
}
