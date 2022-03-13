import { Request } from 'express'
import { UserEntity } from '../../users/user.entity'

export interface RequestWithUser extends Request {
  user: UserEntity
}
