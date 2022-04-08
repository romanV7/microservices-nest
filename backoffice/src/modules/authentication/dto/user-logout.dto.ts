import { IsString, IsNotEmpty, IsDefined } from 'class-validator'

export class UserLogoutDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly token: string
}
