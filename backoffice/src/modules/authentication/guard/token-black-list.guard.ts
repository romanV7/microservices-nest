import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { RedisCacheService } from 'modules/redis/redis-cache.service'
import RequestWithUser from '../interface/request-with-user.interface'

@Injectable()
export class TokenBlackListGuard implements CanActivate {
  constructor(private readonly redisCacheService: RedisCacheService) {}
  async canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest()

    const auth = request.headers.authorization
    const requestToken = auth.split(' ')[1]

    const existingToken = await this.redisCacheService.get<string>(
      request.user.id,
    )

    if (existingToken === requestToken) {
      throw new UnauthorizedException('Login first')
    }

    return true
  }
}
