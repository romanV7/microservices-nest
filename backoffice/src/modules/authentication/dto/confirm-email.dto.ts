import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class ConfirmEmailDto {
  @IsNumber()
  @IsNotEmpty()
  code: number

  @IsString()
  @IsNotEmpty()
  email: string
}
