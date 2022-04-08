import { Transform } from 'class-transformer'
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDefined,
  MinLength,
} from 'class-validator'
import { transformToLowerCaseCallback } from '../../../common'

export class UserLoginDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'email is not valid' })
  @Transform(transformToLowerCaseCallback)
  readonly email: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string
}
