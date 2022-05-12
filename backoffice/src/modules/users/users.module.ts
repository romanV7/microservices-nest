import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { UsersService } from './users.service'
import { UsersController, AdminsController } from './controllers'
import { UserEntity } from './user.entity'
import { RedisCacheModule } from '../redis/redis-cache.module'

@Module({
  imports: [
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
  controllers: [UsersController, AdminsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
