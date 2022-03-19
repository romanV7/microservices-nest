import { RoleType, StatusType } from '../common'
import { UserEntity } from '../modules/users/user.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

const user: Partial<UserEntity> = {
  firstName: 'test',
  lastName: 'test',
  enabled: true,
  status: StatusType.Confirmed,
  email: 'test@user.com',
  password: 'password',
  role: RoleType.Streamer,
  resetPasswordToken: 'resetPasswordToken',
}

export class testUser1646831600464 implements MigrationInterface {
  public async up({ connection }: QueryRunner): Promise<void> {
    await connection.getRepository(UserEntity).save(user)
  }

  public async down({ connection }: QueryRunner): Promise<void> {
    await connection.getRepository(UserEntity).delete({})
  }
}
