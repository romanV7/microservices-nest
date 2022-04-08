import { IsString, IsNotEmpty, IsDefined, MinLength } from 'class-validator'

export class ConfirmResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MinLength(8)
  password: string

  @IsString()
  @IsNotEmpty()
  code: string
}
