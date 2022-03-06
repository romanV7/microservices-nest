import { RoleType } from '../common/constants/role-type'
import { StatusType } from '../common/constants/status-type'
import { UserEntity } from '../modules/users/user.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

const users: Partial<UserEntity>[] = [
  {
    firstName: 'UnConfirmed',
    lastName: 'UnConfirmed',
    enabled: true,
    status: StatusType.UnConfirmed,
    email: 'unconfirmed@user.com',
    emailVerified: true,
    password: 'password',
    role: RoleType.User,
    resetPasswordToken: 'resetPasswordToken',
  },
  {
    firstName: 'confirmed',
    lastName: 'confirmed',
    enabled: true,
    status: StatusType.Confirmed,
    email: 'confirmed@user.com',
    emailVerified: true,
    password: 'password',
    role: RoleType.User,
    resetPasswordToken: 'resetPasswordToken',
  },
]

export class users1646252703690 implements MigrationInterface {
  public async up({ connection }: QueryRunner): Promise<void> {
    await connection.getRepository(UserEntity).save(users)
  }

  public async down({ connection }: QueryRunner): Promise<void> {
    await connection.getRepository(UserEntity).delete({})
  }
}
