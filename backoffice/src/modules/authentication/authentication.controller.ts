import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ConfirmEmailDto,
  ConfirmResetPasswordDto,
  LoginResponse,
  RegisterDto,
  ResetPasswordDto,
  UserLoginDto,
} from './dto'
import {
  SuccessResponse,
  messages,
  createError,
  ErrorTypeEnum,
  getTokenFromAuthHeader,
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
import { ApiTags } from '@nestjs/swagger'

@Controller('auth')
@ApiTags('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly resetPasswordConfirmationService: ResetPasswordConfirmationService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto): Promise<UserDto> {
    const user = await this.authenticationService.register(registrationData)

    const token = await this.emailConfirmationService.setRegisterCode(
      registrationData.email,
    )
    await this.emailConfirmationService.sendVerificationCode(
      registrationData.email,
      token,
    )
    return user
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  async logout(
    @User() user: UserEntity,
    @Headers('authorization') authorization: string,
  ): Promise<SuccessResponse> {
    await this.authenticationService.logout(
      user.id,
      getTokenFromAuthHeader(authorization),
    )

    return { message: messages.authorization.logout }
  }

  @Post('/register/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmRegistration(
    @Body() confirmationData: ConfirmEmailDto,
  ): Promise<SuccessResponse> {
    await this.emailConfirmationService.checkVerificationCode(confirmationData)
    await this.emailConfirmationService.confirmEmail(confirmationData.email)

    return { message: messages.authorization.registrationConfirmed }
  }

  @Post('/password/reset')
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  async confirmPasswordReset(
    @Body() confirmationData: ConfirmResetPasswordDto,
  ): Promise<SuccessResponse> {
    const user = await this.resetPasswordConfirmationService.checkVerificationCode(
      confirmationData,
    )
    await this.resetPasswordConfirmationService.confirmResetPassword(
      user.email,
      confirmationData.password,
    )

    return { message: messages.authorization.passwordResetConfirmed }
  }
}
