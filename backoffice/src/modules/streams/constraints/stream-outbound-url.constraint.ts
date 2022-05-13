import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { messages } from '../../../common'

@ValidatorConstraint({ name: 'StreamOutboundUrl', async: true })
@Injectable()
export class StreamOutboundUrlConstraint
  implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    if (!value) {
      return true
    }

    const prefix = 'https://'
    const ending = '.m3u8'

    return value.startsWith(prefix) && value.endsWith(ending)
  }

  defaultMessage(args: ValidationArguments): string {
    return messages.errors.invalidStreamOutboundUrl
  }
}
