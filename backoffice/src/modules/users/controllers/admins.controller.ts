import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  EmailConfirmationGuard,
  JwtAuthenticationGuard,
  TokenBlackListGuard,
} from '../../authentication/guard'
import { UsersService } from '../users.service'
import { UserDto } from '../dto'
import { ChangePasswordDto } from '../dto/change-password.dto'
import { messages, SuccessResponse } from '../../../common'
import { ApiTags } from '@nestjs/swagger'

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtAuthenticationGuard, TokenBlackListGuard, EmailConfirmationGuard)
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users')
  @UseGuards(JwtAuthenticationGuard)
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll()
  }

  @Get('/users/:userId')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param('userId') userId: string): Promise<UserDto> {
    return this.usersService.getById(userId)
  }

  @Post('/users/:userId/password/change')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(
    @Param('userId') userId: string,
    @Body() changePasswordData: ChangePasswordDto,
  ): Promise<SuccessResponse> {
    await this.usersService.changePassword(userId, changePasswordData)
    return { message: messages.user.changePassword }
  }
}
