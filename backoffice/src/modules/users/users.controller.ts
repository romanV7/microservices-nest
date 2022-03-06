import { Controller, UseGuards } from '@nestjs/common'
import { TokenBlackListGuard } from '../authentication/guard/token-black-list.guard'
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard'
import { UsersService } from './users.service'

@Controller('users')
@UseGuards(JwtAuthenticationGuard, TokenBlackListGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
