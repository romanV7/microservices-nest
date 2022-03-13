import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ConfirmEmailDto,
  ConfirmResetPasswordDto,
  LoginResponse,
  RegisterDto,
  ResetPasswordDto,
  UserLoginDto,
  UserLogoutDto,
} from './dto'
import {
  SuccessResponse,
  messages,
  createError,
  ErrorTypeEnum,
} from '../../common'
import { JwtAuthenticationGuard } from './guard'
import { User } from '../../decorators'
import { UserEntity } from '../users/user.entity'
import { UserDto } from '../users/dto'
import {
  ResetPasswordConfirmationService,
  EmailConfirmationService,
  AuthenticationService,
} from './services'

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly resetPasswordConfirmationService: ResetPasswordConfirmationService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto): Promise<UserDto> {
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
        createError(
          ErrorTypeEnum.INVALID_CREDENTIALS,
          messages.errors.invalidCredentialsCombination,
        ),
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

  @Post('/register/confirm')
  async confirmRegistration(
    @Body() confirmationData: ConfirmEmailDto,
  ): Promise<void> {
    await this.emailConfirmationService.checkVerificationCode(confirmationData)
    await this.emailConfirmationService.confirmEmail(confirmationData.email)
  }

  @Post('/password/reset')
  async resetPassword(
    @Body() resetPasswordData: ResetPasswordDto,
  ): Promise<void> {
    const token = await this.resetPasswordConfirmationService.setResetPassword(
      resetPasswordData.email,
    )
    await this.resetPasswordConfirmationService.sendVerificationCode(
      resetPasswordData.email,
      token,
    )
  }

  @Post('/password/reset/confirm')
  async confirmPasswordReset(
    @Body() confirmationData: ConfirmResetPasswordDto,
  ): Promise<void> {
    const user = await this.resetPasswordConfirmationService.checkVerificationCode(
      confirmationData,
    )
    await this.resetPasswordConfirmationService.confirmResetPassword(
      user.email,
      confirmationData.password,
    )
  }
}
