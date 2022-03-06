import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'

import { AuthenticationService } from './authentication.service'
import { RegisterDto } from './dto/register.dto'
import { UserLoginDto } from './dto/user-login.dto'
import { LoginResponse } from './dto/response-login.dto'
import { UserLogoutDto } from './dto/user-logout.dto'
import { SuccessResponse } from '../../common/dto/success-response.dto'
import JwtAuthenticationGuard from './guard/jwt-authentication.guard'
import { User } from '../../decorators/user.decorator'
import { UserEntity } from '../users/user.entity'
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service'

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    const user = await this.authenticationService.register(registrationData)
    await this.emailConfirmationService.sendVerificationCode(
      registrationData.email,
    )
    return user
  }

  @Post('login')
  async userLogin(@Body() userLoginDto: UserLoginDto): Promise<LoginResponse> {
    const loginResults: LoginResponse = await this.authenticationService.login(
      userLoginDto,
    )
    if (!loginResults) {
      throw new UnauthorizedException(
        'This email, password combination was not found',
      )
    }

    return loginResults
  }

  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  async logout(
    @Body() userLogoutDto: UserLogoutDto,
    @User() user: UserEntity,
  ): Promise<SuccessResponse> {
    await this.authenticationService.logout(user.id, userLogoutDto.token)

    return { message: 'ok' }
  }
}
