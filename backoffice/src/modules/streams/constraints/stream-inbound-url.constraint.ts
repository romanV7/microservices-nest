import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { messages } from '../../../common'

@ValidatorConstraint({ name: 'StreamInboundUrl', async: true })
@Injectable()
export class StreamInboundUrlConstraint
  implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    if (!value) {
      return true
    }

    const prefix = 'srt://'

    return value.startsWith(prefix)
  }

  defaultMessage(args: ValidationArguments): string {
    return messages.errors.invalidStreamInboundUrl
  }
}
