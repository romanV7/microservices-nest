import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { transformToLowerCaseCallback } from '../../../common'

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'email is not valid' })
  @IsString()
  @Transform(transformToLowerCaseCallback)
  email: string
}
