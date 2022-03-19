import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterDto } from '../authentication/dto'
import { Repository } from 'typeorm'
import { createError, ErrorTypeEnum, messages, StatusType } from '../../common'
import { UserEntity } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: RegisterDto): Promise<UserEntity> {
    return this.userRepository.save(createUserDto)
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({ id })
    if (!user) {
      throw new HttpException(
        createError(ErrorTypeEnum.USER_NOT_FOUND, messages.errors.userNotFound),
        HttpStatus.NOT_FOUND,
      )
    }

    return user
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email })
    if (!user) {
      throw new HttpException(
        createError(ErrorTypeEnum.USER_NOT_FOUND, messages.errors.userNotFound),
        HttpStatus.NOT_FOUND,
      )
    }

    return user
  }

  async getByOptions(params: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne(params)
  }

  async markStatusAsConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        status: StatusType.Confirmed,
      },
    )
  }

  async setResetPasswordToken(email: string, resetPasswordToken: string) {
    return this.userRepository.update(
      { email },
      {
        resetPasswordToken,
      },
    )
  }

  async setPassword(email: string, password: string) {
    return this.userRepository.update(
      { email },
      {
        password,
      },
    )
  }

  async removeResetPasswordToken(email: string) {
    return this.userRepository.update(
      { email },
      {
        resetPasswordToken: null,
      },
    )
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find()
  }
}
