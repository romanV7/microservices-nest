import { IsEnum, IsOptional, IsString } from 'class-validator'
import { RoleType } from '../../../common'

export class RegisterDto {
  @IsString()
  email: string

  @IsString()
  password: string

  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType
}
