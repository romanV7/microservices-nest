import { JwtService } from '@nestjs/jwt'
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../../users/users.service'
import { TokenPayload } from '../interface'
import { RegisterDto, UserLoginDto, LoginResponse } from '../dto'
import { UtilsService } from '../../../providers'
import { RedisCacheService } from '../../redis/redis-cache.service'
import { UserEntity } from '../../users/user.entity'
import { createError, ErrorTypeEnum, messages } from 'common'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const existingUser = await this.usersService.getByOptions({
      email: registrationData.email,
    })

    if (existingUser) {
      throw new HttpException(
        createError(
          ErrorTypeEnum.USER_ALREADY_EXIST,
          messages.errors.userExists,
        ),
        HttpStatus.BAD_REQUEST,
      )
    }
    return this.usersService.create(registrationData)
  }

  async login(credentials: UserLoginDto): Promise<LoginResponse> {
    const loginResults = await this.validateUser(credentials)

    const payload: TokenPayload = {
      userId: loginResults.id,
    }

    return this.createAccessToken(payload, loginResults)
  }

  async createAccessToken(
    payload: TokenPayload,
    user: UserEntity,
  ): Promise<LoginResponse> {
    const signedPayload = await this.jwtService.signAsync({
      userId: payload.userId,
      email: user.email,
      role: user.role,
    })

    const token: LoginResponse = {
      tokenType: 'Bearer',
      accessToken: signedPayload,
    }

    return token
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.usersService.getByEmail(userLoginDto.email)

    const isPasswordValid = await UtilsService.validateHash(
      userLoginDto.password,
      user && user.password,
    )
    if (!user) {
      throw new NotFoundException(
        createError(ErrorTypeEnum.USER_NOT_FOUND, messages.errors.userNotFound),
      )
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        createError(
          ErrorTypeEnum.INVALID_CREDENTIALS,
          messages.errors.invalidCredentialsCombination,
        ),
      )
    }
    return user
  }

  async logout(userId: string, token: string): Promise<any> {
    const redisKey = `logout:${userId}`

    await this.redisCacheService.set(redisKey, token)
  }
}
