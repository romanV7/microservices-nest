import { IsString, IsNotEmpty } from 'class-validator'

export class ConfirmResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  code: string
}
