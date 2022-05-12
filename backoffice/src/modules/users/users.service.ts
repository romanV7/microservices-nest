import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

import { RegisterDto } from '../authentication/dto'
import { createError, ErrorTypeEnum, messages, StatusType } from '../../common'
import { ChangePasswordDto, UserDto } from './dto'
import { UtilsService } from '../../providers'

@Injectable()
export class UsersService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  create(createUserDto: RegisterDto): Promise<UserDto> {
    return this.knex.table('users').insert(createUserDto)
  }

  async getById(id: string): Promise<UserDto> {
    const user = await this.knex.table('users').where('id', id)
    if (!user) {
      throw new NotFoundException(
        createError(ErrorTypeEnum.USER_NOT_FOUND, messages.errors.userNotFound),
      )
    }

    return new UserDto(user)
  }

  async getByEmail(email: string) {
    const user = await this.knex.table('users').where('email', email)
    if (!user) {
      throw new NotFoundException(
        createError(ErrorTypeEnum.USER_NOT_FOUND, messages.errors.userNotFound),
      )
    }

    return user
  }

  async getByOptions(params: Partial<UserDto>): Promise<UserDto> {
    return this.knex.table('users').where('id', params)
  }

  async markStatusAsConfirmed(email: string) {
    return this.knex
      .table('users')
      .where('email', email)
      .update({
        status: StatusType.Confirmed,
      })
  }

  async setResetPasswordToken(email: string, resetPasswordToken: string) {
    return this.knex
      .table('users')
      .where('email', email)
      .update({
        resetPasswordToken,
      })
  }

  async setPassword(email: string, password: string) {
    return this.knex
      .table('users')
      .where('email', email)
      .update({
        password,
      })
  }

  async removeResetPasswordToken(email: string) {
    return this.knex
      .table('users')
      .where('email', email)
      .update({
        resetPasswordToken: null,
      })
  }

  async findAll(): Promise<UserDto[]> {
    const users: UserDto[] = await this.knex.table('users')
    return users.map(_ => new UserDto(_))
  }

  async changePassword(
    userId: string,
    changePasswordData: ChangePasswordDto,
  ): Promise<void> {
    const user: any = await this.getByOptions({ id: userId })

    const {
      oldPassword,
      newPassword,
      newPasswordForConfirmation,
    } = changePasswordData

    this.comparePasswords(newPassword, newPasswordForConfirmation)

    const isMatch = await UtilsService.comparePasswords(
      oldPassword,
      user.password,
    )

    if (!isMatch) {
      throw new ForbiddenException(
        createError(
          ErrorTypeEnum.USER_INVALID_PASSWORD,
          messages.errors.wrongOldPassword,
        ),
      )
    }

    await this.setPassword(user.email, changePasswordData.newPassword)
  }

  comparePasswords(password: string, confirmPassword: string): boolean {
    const checked = password === confirmPassword

    if (!checked) {
      throw new BadRequestException(
        createError(
          ErrorTypeEnum.INVALID_CREDENTIALS,
          messages.errors.wrongNewPasswordComparation,
        ),
      )
    }
    return checked
  }
}
