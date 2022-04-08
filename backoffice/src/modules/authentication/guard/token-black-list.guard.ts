import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { createError, ErrorTypeEnum, messages } from '../../../common'
import { RedisCacheService } from '../../redis/redis-cache.service'
import { RequestWithUser } from '../interface'

@Injectable()
export class TokenBlackListGuard implements CanActivate {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest()

    const auth = request.headers.authorization
    const requestToken = auth.split(' ')[1]

    const redisKey = `logout:${request.user.id}`

    const existingToken = await this.redisCacheService.get<string>(redisKey)

    if (existingToken === requestToken) {
      throw new UnauthorizedException(
        createError(
          ErrorTypeEnum.TOKEN_BLACKLISTED,
          messages.errors.tokenBlacklisted,
        ),
      )
    }

    return true
  }
}
