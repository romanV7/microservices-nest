import { Entity, Column } from 'typeorm'
import { AbstractEntity, RoleType, StatusType } from '../../common'
import { UserDto } from './dto'
import { PasswordTransformer } from './password.transformer'

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ nullable: false, default: false })
  enabled: boolean

  @Column({ type: 'enum', enum: StatusType, default: StatusType.UnConfirmed })
  status: StatusType

  @Column({ unique: true, nullable: false, length: 255 })
  email: string

  @Column({
    nullable: true,
    transformer: new PasswordTransformer(),
    length: 255,
  })
  password: string

  @Column({ type: 'enum', enum: RoleType, default: RoleType.Streamer })
  role: RoleType

  @Column()
  resetPasswordToken: string
}
