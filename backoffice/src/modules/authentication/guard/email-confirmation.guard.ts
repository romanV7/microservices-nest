import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import {
  createError,
  ErrorTypeEnum,
  messages,
  StatusType,
} from '../../../common'
import { RequestWithUser } from '../interface'

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest()

    if (request.user?.status === StatusType.UnConfirmed) {
      throw new ForbiddenException(
        createError(
          ErrorTypeEnum.INVALID_CREDENTIALS,
          messages.errors.emailNotConfimed,
        ),
      )
    }

    return true
  }
}
