import { Module } from '@nestjs/common'
import { EmailModule } from '../mailer/email.module'
import { RedisCacheModule } from '../redis/redis-cache.module'
import { UsersModule } from '../users/users.module'
import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
  imports: [UsersModule, RedisCacheModule, EmailModule],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
