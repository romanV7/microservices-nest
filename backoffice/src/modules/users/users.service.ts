import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterDto } from '../authentication/dto'
import { Repository } from 'typeorm'
import { createError, ErrorTypeEnum, messages, StatusType } from '../../common'
import { UserEntity } from './user.entity'
import { ChangePasswordDto, UserDto } from './dto'
import { UtilsService } from '../../providers'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: RegisterDto): Promise<UserEntity> {
    return this.userRepository.save(createUserDto)
  }

  async getById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ id })
    if (!user) {
      throw new NotFoundException(
        createError(ErrorTypeEnum.USER_NOT_FOUND, messages.errors.userNotFound),
      )
    }

    return new UserDto(user)
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email })
    if (!user) {
      throw new NotFoundException(
        createError(ErrorTypeEnum.USER_NOT_FOUND, messages.errors.userNotFound),
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

  async findAll(): Promise<UserDto[]> {
    const users: UserEntity[] = await this.userRepository.find({
      order: {
        createdAt: 'ASC',
      },
    })

    return users.map(_ => new UserDto(_))
  }

  async changePassword(
    userId: string,
    changePasswordData: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.getByOptions({ id: userId })

    const {
      oldPassword,
      newPassword,
      newPasswordForConfirmation,
    } = changePasswordData

    this.comparePasswords(newPassword, newPasswordForConfirmation)

    const isMatch = await UtilsService.comparePasswords(
      oldPassword,
      user.password,
    )

    if (!isMatch) {
      throw new ForbiddenException(
        createError(
          ErrorTypeEnum.USER_INVALID_PASSWORD,
          messages.errors.wrongOldPassword,
        ),
      )
    }

    await this.setPassword(user.email, changePasswordData.newPassword)
  }

  comparePasswords(password: string, confirmPassword: string): boolean {
    const checked = password === confirmPassword

    if (!checked) {
      throw new BadRequestException(
        createError(
          ErrorTypeEnum.INVALID_CREDENTIALS,
          messages.errors.wrongNewPasswordComparation,
        ),
      )
    }
    return checked
  }
}
