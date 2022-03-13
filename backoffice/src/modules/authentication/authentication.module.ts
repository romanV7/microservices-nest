import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthenticationController } from './authentication.controller'
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './strategy'
import { RedisCacheModule } from '../redis/redis-cache.module'
import { EmailService } from '../../providers'
import {
  ResetPasswordConfirmationService,
  EmailConfirmationService,
  AuthenticationService,
} from './services'

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get<number>('jwt.expiresIn')}s`,
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RedisCacheModule,
  ],
  providers: [
    AuthenticationService,
    JwtStrategy,
    EmailService,
    EmailConfirmationService,
    ResetPasswordConfirmationService,
  ],
  controllers: [AuthenticationController],
  exports: [PassportModule, JwtStrategy],
})
export class AuthenticationModule {}
