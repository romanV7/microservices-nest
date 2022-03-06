import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterDto } from 'modules/authentication/dto/register.dto'
import { Repository } from 'typeorm'
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
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      )
    }

    return user
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email })
    if (!user) {
      throw new HttpException(
        `User with ${email} does not exist`,
        HttpStatus.NOT_FOUND,
      )
    }

    return user
  }

  async getByOptions(params: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne(params)
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        emailVerified: true,
      },
    )
  }
}
