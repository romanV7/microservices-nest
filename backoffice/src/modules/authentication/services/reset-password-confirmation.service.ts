import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { UsersService } from '../../users/users.service'
import { UtilsService, EmailService } from '../../../providers'
import {
  MailerMessages,
  messages,
  ErrorTypeEnum,
  createError,
} from '../../../common'
import { ConfirmResetPasswordDto } from '../dto'
import { UserDto } from 'modules/users/dto'

@Injectable()
export class ResetPasswordConfirmationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  public async sendVerificationCode(email: string, code: string) {
    return this.emailService.sendText(
      email,
      MailerMessages.ResetPassword,
      messages.authorization.resetPassword(code),
    )
  }

  public async setResetPassword(email: string): Promise<string> {
    const user = await this.usersService.getByEmail(email)

    const token = await UtilsService.generateToken(20, 'hex')

    await this.usersService.setResetPasswordToken(user.email, token)

    return token
  }

  public async confirmResetPassword(email: string, password: string) {
    await this.usersService.setPassword(email, password)
    await this.usersService.removeResetPasswordToken(email)
  }

  public async checkVerificationCode(
    confirmResetPasswordDto: ConfirmResetPasswordDto,
  ): Promise<UserDto> {
    const existingUser = await this.usersService.getByOptions({
      resetPasswordToken: confirmResetPasswordDto.code,
    })

    if (!existingUser) {
      throw new HttpException(
        createError(ErrorTypeEnum.USER_NOT_FOUND, messages.errors.userNotFound),
        HttpStatus.BAD_REQUEST,
      )
    }

    if (existingUser.resetPasswordToken !== confirmResetPasswordDto.code) {
      throw new BadRequestException(
        createError(
          ErrorTypeEnum.INVALID_CONFIRMATION_CODE,
          messages.errors.invalidConfirmationToken,
        ),
      )
    }

    return existingUser
  }
}
