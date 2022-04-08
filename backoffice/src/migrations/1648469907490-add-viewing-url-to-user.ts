import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addViewingUrlToUser1648469907490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'viewing_url',
        type: 'character varying(255)',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'viewing_url')
  }
}
