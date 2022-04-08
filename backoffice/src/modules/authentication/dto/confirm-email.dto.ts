import { Transform } from 'class-transformer'
import { IsString, IsNotEmpty, IsNumber, IsEmail } from 'class-validator'
import { transformToLowerCaseCallback } from '../../../common'

export class ConfirmEmailDto {
  @IsNumber()
  @IsNotEmpty()
  code: number

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'email is not valid' })
  @Transform(transformToLowerCaseCallback)
  email: string
}
