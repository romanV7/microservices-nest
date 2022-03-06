import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { RedisCacheService } from 'modules/redis/redis-cache.service'
import { ConfirmEmailDto } from './dto/confirm-email.dto'
import { EmailService } from '../mailer/email.service'

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  public async sendVerificationCode(email: string) {
    // add code generator
    const code = 123

    await this.redisCacheService.set(email, code)

    // add messages

    const text = `Welcome to the application. To confirm the email address, enter confirmation code: ${code}`

    return this.emailService.sendText(email, 'Email confirmation', text)
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.getByEmail(email)
    if (user.emailVerified) {
      throw new BadRequestException('Email already confirmed')
    }
    await this.usersService.markEmailAsConfirmed(email)
  }

  public async checkVerificationCode(
    confirmEmailDto: ConfirmEmailDto,
  ): Promise<void> {
    const existingCode = await this.redisCacheService.get<string>(
      confirmEmailDto.email,
    )

    if (existingCode !== confirmEmailDto.code) {
      throw new BadRequestException('Bad confirmation token')
    }
  }
}
