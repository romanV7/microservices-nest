import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { RedisCacheModule } from 'modules/redis/redis-cache.module'

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
    TypeOrmModule.forFeature([UserEntity]),
    RedisCacheModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
