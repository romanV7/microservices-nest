import { JwtService } from '@nestjs/jwt'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { UsersService } from '../users/users.service'
import { ConfigService } from '@nestjs/config'
import { TokenPayload } from './interface/token-payload.interface'
import { RegisterDto } from './dto/register.dto'
import { UserLoginDto } from './dto/user-login.dto'
import { LoginResponse } from './dto/response-login.dto'
import { UserEntity } from '../users/user.entity'
import { UtilsService } from '../../providers/utils.service'
import { UserNotFoundException } from '../../exceptions/user-not-found.exception'
import { RedisCacheService } from '../redis/redis-cache.service'

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
        'User with that email already exists',
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
    if (!user || !isPasswordValid) {
      throw new UserNotFoundException()
    }
    return user
  }

  async logout(userId: string, token: string): Promise<any> {
    await this.redisCacheService.set(userId, token)
  }
}
