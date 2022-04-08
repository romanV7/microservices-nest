import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPasswordForConfirmation: string
}
