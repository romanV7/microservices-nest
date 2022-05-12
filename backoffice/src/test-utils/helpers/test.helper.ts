import { INestApplication } from '@nestjs/common'
import { RedisCacheService } from '../../modules/redis/redis-cache.service'
import { UsersService } from '../../modules/users/users.service'
import { BaseTestHelper } from './base-test.helper'
import { ConfigService } from '@nestjs/config'
import { StreamDto } from '../../modules/streams/dto'
import { StreamsService } from '../../modules/streams/streams.service'

export class TestHelper extends BaseTestHelper {
  private readonly redisCacheService: RedisCacheService

  private readonly usersService: UsersService

  private readonly configService: ConfigService

  private readonly streamsService: StreamsService

  constructor(app: INestApplication) {
    super(app)

    this.redisCacheService = this.app.get<RedisCacheService>(RedisCacheService)
    this.usersService = app.get<UsersService>(UsersService)
    this.configService = app.get<ConfigService>(ConfigService)
  }

  public async getPasswordResetToken(userId: string): Promise<string> {
    const user = await this.usersService.getByOptions({
      id: userId,
    })

    return user.resetPasswordToken
  }

  public async getCodeByKey(redisKey: string) {
    return this.redisCacheService.get<number>(redisKey)
  }

  public get fixturesPath(): string {
    return this.configService.get<string>('fixturesPath')
  }
}
