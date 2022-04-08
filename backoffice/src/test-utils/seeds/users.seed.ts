import { RoleType, StatusType } from '../../common'
import { UserEntity } from '../../modules/users/user.entity'

export const users: Partial<UserEntity>[] = [
  {
    firstName: 'Bob',
    lastName: 'Davidson',
    enabled: true,
    status: StatusType.UnConfirmed,
    email: 'unconfirmed@user.com',
    password: 'password',
    role: RoleType.Streamer,
    resetPasswordToken: 'resetPasswordToken',
  },
  {
    firstName: 'John',
    lastName: 'Smith',
    enabled: true,
    status: StatusType.Confirmed,
    email: 'confirmed@user.com',
    password: 'password',
    role: RoleType.Streamer,
    resetPasswordToken: 'resetPasswordToken',
  },
]
