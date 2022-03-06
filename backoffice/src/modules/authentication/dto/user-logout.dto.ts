import { IsString, IsNotEmpty } from 'class-validator'

export class UserLogoutDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string
}
