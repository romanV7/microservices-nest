import { Module } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { UsersModule } from '../users/users.module'
import { AuthenticationController } from './authentication.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategy/jwt.strategy'
import { RedisCacheModule } from '../redis/redis-cache.module'
import { EmailConfirmationModule } from '../email-confirmation/email-confirmation.module'

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
    EmailConfirmationModule,
  ],
  providers: [AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController],
  exports: [PassportModule, JwtStrategy],
})
export class AuthenticationModule {}
