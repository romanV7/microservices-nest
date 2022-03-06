import { IsString, IsEmail, IsNotEmpty } from 'class-validator'

export class UserLoginDto {
  @IsString()
  @IsEmail({}, { message: 'Email is invalid' })
  readonly email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string
}
