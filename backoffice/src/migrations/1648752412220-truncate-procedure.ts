import { MigrationInterface, QueryRunner } from 'typeorm'

export class truncateProcedure1648752412220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
        DECLARE
            statements CURSOR FOR
                SELECT tablename FROM pg_tables
                WHERE tableowner = username AND schemaname = 'public';
        BEGIN
            FOR stmt IN statements LOOP
                EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
            END LOOP;
        END;
        $$ LANGUAGE plpgsql;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
