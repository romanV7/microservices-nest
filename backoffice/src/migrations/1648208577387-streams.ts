import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class streams1648208577387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'streams',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'character varying(255)',
            isNullable: true,
          },
          {
            name: 'scheduled_for',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'scheduled_duration',
            type: 'interval',
            isNullable: true,
          },
          {
            name: 'actual_duration',
            type: 'interval',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['REGULAR', 'TEST'],
            default: `'REGULAR'`,
            isNullable: false,
          },
          {
            name: 'inbound_url',
            type: 'character varying(255)',
            isNullable: true,
          },

          {
            name: 'outbound_url',
            type: 'character varying(255)',
            isNullable: true,
          },
          {
            name: 'archive_url',
            type: 'character varying(255)',
            isNullable: true,
          },
          {
            name: 'max_viewers_count',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            generationStrategy: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'CREATED',
              'ACTIVATING',
              'ACTIVATED',
              'STARTED',
              'STOPPED',
              'DEACTIVATING',
              'DEACTIVATED',
            ],
            default: `'CREATED'`,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'started_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'activation_initiated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'activation_completed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deactivation_initiated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deactivation_completed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    )

    await queryRunner.createForeignKey(
      'streams',
      new TableForeignKey({
        name: 'FK_3ddc983c5f7bcf132fd8732c3f4',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'streams',
      'FK_3ddc983c5f7bcf132fd8732c3f4',
    )
    await queryRunner.dropTable('streams')
  }
}
