import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class ConfirmEmailDto {
  @IsNumber()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  email: string
}
