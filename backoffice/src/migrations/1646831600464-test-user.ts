import { UserEntity } from '../modules/users/user.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class testUser1646831600464 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "users" (
        "first_name",
        "last_name",
        "enabled",
        "status",
        "email",
        "password",
        "role",
        "reset_password_token"
      ) VALUES (
        'test', 'test', true, 'CONFIRMED', 'test@user.com', 'password', 'STREAMER', 'resetPasswordToken'
      )`,
      undefined,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.getRepository(UserEntity).delete({})
  }
}
