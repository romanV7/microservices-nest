import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  EmailConfirmationGuard,
  JwtAuthenticationGuard,
  TokenBlackListGuard,
} from '../../authentication/guard'
import { UsersService } from '../users.service'
import { User } from '../../../decorators'
import { UserEntity } from '../user.entity'
import { UserDto } from '../dto'
import { ChangePasswordDto } from '../dto/change-password.dto'
import { messages, SuccessResponse } from '../../../common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller()
@ApiTags('users')
@UseGuards(JwtAuthenticationGuard, TokenBlackListGuard, EmailConfirmationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async getCurrentUser(@User() user: UserEntity): Promise<UserDto> {
    return this.usersService.getById(user.id)
  }

  @Post('/me/password/change')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(
    @User() user: UserEntity,
    @Body() changePasswordData: ChangePasswordDto,
  ): Promise<SuccessResponse> {
    await this.usersService.changePassword(user.id, changePasswordData)
    return { message: messages.user.changePassword }
  }
}
