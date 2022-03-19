import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm'

export class users1646252708705 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'enabled',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['CONFIRMED', 'UNCONFIRMED'],
            default: `'UNCONFIRMED'`,
            isNullable: false,
          },
          {
            name: 'email',
            type: 'character varying(255)',
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'character varying(255)',
            isNullable: true,
          },
          {
            name: 'last_name',
            type: 'character varying(255)',
            isNullable: true,
          },
          {
            name: 'password',
            type: 'character varying(255)',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['STREAMER', 'ADMIN', 'STREAM_PROVIDER'],
            default: `'STREAMER'`,
            isNullable: false,
          },
          {
            name: 'reset_password_token',
            type: 'character varying(255)',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    )

    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({
        name: 'UQ_fe0bb3f6520ee0469504521e711',
        columnNames: ['email'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'users',
      'UQ_fe0bb3f6520ee0469504521e711',
    )
    await queryRunner.dropTable('users')
  }
}
