import { Transform } from 'class-transformer'
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { transformToLowerCaseCallback, RoleType } from '../../../common'

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'email is not valid' })
  @IsString()
  @Transform(transformToLowerCaseCallback)
  email: string

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MinLength(8)
  password: string

  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType
}
