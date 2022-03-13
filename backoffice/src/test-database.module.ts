import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('testDatabase.host'),
        port: configService.get<number>('testDatabase.port'),
        username: configService.get<string>('testDatabase.user'),
        password: configService.get<string>('testDatabase.password'),
        database: configService.get<string>('testDatabase.database'),
        keepConnectionAlive: true,
        migrationsRun: true,
        autoLoadEntities: true,
        logging: configService.get<string>('NODE_ENV') === 'development',
        entities: [`${__dirname}/modules/**/*.entity.ts`],
        migrations: [`${__dirname}/migrations/*{.ts,.js}`],
        migrationsTableName: 'backend_migrations',
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class TestDatabaseModule {}
