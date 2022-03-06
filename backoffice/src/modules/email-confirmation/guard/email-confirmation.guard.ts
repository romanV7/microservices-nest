import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import RequestWithUser from '../../authentication/interface/request-with-user.interface'

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest()

    if (!request.user?.emailVerified) {
      throw new UnauthorizedException('Confirm your email first')
    }

    return true
  }
}
