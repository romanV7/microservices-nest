import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { messages } from '../../../common'

@ValidatorConstraint({ name: 'StreamTitle', async: true })
@Injectable()
export class StreamTitleConstraint implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    if (!value) {
      return true
    }

    return /.+\s+(vs|Vs|vS|VS)\s+.+/.test(value)
  }

  defaultMessage(args: ValidationArguments): string {
    return messages.errors.invalidStreamTitle
  }
}
