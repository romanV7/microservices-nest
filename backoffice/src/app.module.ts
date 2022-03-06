import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DatabaseModule } from './database.module'
import { UsersModule } from './modules/users/users.module'
import { configuration } from './config/configuration'
import { AuthenticationModule } from './modules/authentication/authentication.module'
import { EmailConfirmationModule } from './modules/email-confirmation/email-confirmation.module'
import { EmailModule } from './modules/mailer/email.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    EmailConfirmationModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
