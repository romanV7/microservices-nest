import { Controller, Post, Body } from '@nestjs/common'
import { EmailConfirmationService } from './email-confirmation.service'
import { ConfirmEmailDto } from './dto/confirm-email.dto'

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto): Promise<void> {
    await this.emailConfirmationService.checkVerificationCode(confirmationData)
    await this.emailConfirmationService.confirmEmail(confirmationData.email)
  }
}
