import { INestApplication } from '@nestjs/common'
import { RedisCacheService } from '../../modules/redis/redis-cache.service'
import { UsersService } from '../../modules/users/users.service'
import { UserEntity } from '../../modules/users/user.entity'
import { BaseTestHelper } from './base-test.helper'

export class TestHelper extends BaseTestHelper {
  private readonly redisCacheService: RedisCacheService

  private readonly usersService: UsersService

  constructor(app: INestApplication) {
    super(app)

    this.redisCacheService = this.app.get<RedisCacheService>(RedisCacheService)
    this.usersService = app.get<UsersService>(UsersService)
  }

  public async getPasswordResetToken(userId: string): Promise<string> {
    const user: UserEntity = await this.usersService.getByOptions({
      id: userId,
    })

    return user.resetPasswordToken
  }

  public async getCodeByKey(redisKey: string) {
    return this.redisCacheService.get<number>(redisKey)
  }
}
