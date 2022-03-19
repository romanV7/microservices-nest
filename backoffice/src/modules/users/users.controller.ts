import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import {
  EmailConfirmationGuard,
  JwtAuthenticationGuard,
  TokenBlackListGuard,
} from '../authentication/guard'
// import { EmailConfirmationGuard } from '../email-confirmation/guard'
import { UsersService } from './users.service'
import { User } from '../../decorators'
import { UserEntity } from './user.entity'
import { UserDto } from './dto'

@Controller('users')
@UseGuards(JwtAuthenticationGuard, TokenBlackListGuard, EmailConfirmationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  async getCurrentUser(@User() user: UserEntity): Promise<UserDto> {
    return this.usersService.getById(user.id)
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll()
  }

  @Get(':userId')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param('userId') userId: string): Promise<UserDto> {
    return this.usersService.getById(userId)
  }
}
