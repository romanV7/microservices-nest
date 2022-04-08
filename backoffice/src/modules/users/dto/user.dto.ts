import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator'
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
  @IsEmail({}, { message: 'email is not valid' })
  @IsNotEmpty()
  email: string

  @IsEnum(RoleType)
  role: RoleType

  constructor(user) {
    super(user)
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.enabled = user.enabled
    this.status = user.status
    this.email = user.email
    this.role = user.role
  }
}
