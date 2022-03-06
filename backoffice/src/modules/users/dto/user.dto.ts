import { IsBoolean, IsEnum, IsString } from 'class-validator'
import { StatusType } from '../../../common/constants/status-type'
import { RoleType } from '../../../common/constants/role-type'
import { AbstractDto } from '../../../common/dto/abstract.dto'

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

  @IsBoolean()
  emailVerified: boolean

  @IsString()
  password: string

  @IsEnum(RoleType)
  role: RoleType

  @IsString()
  resetPasswordToken: string
}
