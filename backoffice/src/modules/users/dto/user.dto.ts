import { IsBoolean, IsEnum, IsString } from 'class-validator'
import { AbstractDto, StatusType, RoleType } from '../../../common'

export class UserDto extends AbstractDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsBoolean()
  enabled: boolean

  @IsEnum(StatusType)
  status: StatusType

  @IsString()
  email: string

  @IsString()
  password: string

  @IsEnum(RoleType)
  role: RoleType

  @IsString()
  resetPasswordToken: string
}
