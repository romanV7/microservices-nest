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
        migrationsRun: false,
        autoLoadEntities: true,
        logging: false,
        entities: [`${__dirname}/modules/**/*.entity{.ts,.js}`],
        migrations: [`${__dirname}/migrations/*{.ts,.js}`],
        migrationsTableName: 'backend_migrations',
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class TestDatabaseModule {}
