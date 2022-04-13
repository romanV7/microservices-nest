import { Entity, Column, AfterInsert } from 'typeorm'
import { AbstractEntity, RoleType, StatusType } from '../../common'
import { PasswordTransformer } from './password.transformer'

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ nullable: true })
  firstName: string

  @Column({ nullable: true })
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

  @Column({ nullable: true })
  resetPasswordToken: string

  @Column({ nullable: true })
  viewingUrl: string

  @AfterInsert()
  async validate() {
    this.viewingUrl = `/${this.id}`
  }
}
