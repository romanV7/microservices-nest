import { IsOptional, IsString } from 'class-validator'

export class LoginResponse {
  @IsString()
  accessToken: string

  @IsString()
  @IsOptional()
  tokenType?: string = 'bearer'
}
