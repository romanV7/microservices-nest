import { Connection } from 'typeorm'
import { StreamEntity } from '../../modules/streams/streams.entity'
import { UserEntity } from '../../modules/users/user.entity'
import { streams, users } from '../seeds'

export class SeedsHelper {
  private readonly connection: Connection

  constructor(connection: Connection) {
    this.connection = connection
  }

  public async createTestUsers() {
    return this.connection.getRepository(UserEntity).save(users)
  }

  public async createTestStreams() {
    const user: UserEntity = await this.connection
      .getRepository(UserEntity)
      .findOne({ email: 'confirmed@user.com' })

    return this.connection.getRepository(StreamEntity).save(
      streams.map(stream => ({
        ...stream,
        user,
      })),
    )
  }
}
