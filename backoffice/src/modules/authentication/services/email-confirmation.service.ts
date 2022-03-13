import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from '../../users/users.service'
import { RedisCacheService } from '../../redis/redis-cache.service'
import { ConfirmEmailDto } from '../dto'
import { UtilsService, EmailService } from '../../../providers'
import {
  MailerMessages,
  StatusType,
  messages,
  ErrorTypeEnum,
  createError,
} from '../../../common'

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  public async sendVerificationCode(email: string) {
    const code = UtilsService.generateVerificationCode()

    const redisKey = `register:${email}`

    await this.redisCacheService.set(redisKey, code)

    return this.emailService.sendText(
      email,
      MailerMessages.Register,
      messages.authorization.register(code),
    )
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.getByEmail(email)
    if (user.status === StatusType.Confirmed) {
      throw new BadRequestException(
        createError(
          ErrorTypeEnum.INVALID_CONFIRMATION_CODE,
          messages.errors.emailConfirmed,
        ),
      )
    }
    await this.usersService.markStatusAsConfirmed(email)
  }

  public async checkVerificationCode(
    confirmEmailDto: ConfirmEmailDto,
  ): Promise<void> {
    const redisKey = `register:${confirmEmailDto.email}`

    const existingCode = await this.redisCacheService.get<number>(redisKey)

    if (existingCode !== confirmEmailDto.code) {
      throw new BadRequestException(
        createError(
          ErrorTypeEnum.INVALID_CONFIRMATION_CODE,
          messages.errors.invalidConfirmationToken,
        ),
      )
    }
  }
}
