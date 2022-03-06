import { Entity, Column } from 'typeorm'

import { AbstractEntity } from '../../common/abstract.entity'
import { RoleType } from '../../common/constants/role-type'
import { UserDto } from './dto/user.dto'
import { StatusType } from '../../common/constants/status-type'
import { PasswordTransformer } from './password.transformer'

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  enabled: boolean

  @Column({ type: 'enum', enum: StatusType, default: StatusType.UnConfirmed })
  status: StatusType

  @Column({ unique: true, nullable: false, length: 255 })
  email: string

  @Column({ default: false })
  emailVerified: boolean

  @Column({
    nullable: true,
    transformer: new PasswordTransformer(),
    length: 255,
  })
  password: string

  @Column({ type: 'enum', enum: RoleType, default: RoleType.User })
  role: RoleType

  @Column()
  resetPasswordToken: string
}
