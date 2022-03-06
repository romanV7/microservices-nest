import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        keepConnectionAlive: true,
        migrationsRun: true,
        autoLoadEntities: true,
        logging: configService.get<string>('NODE_ENV') === 'development',
        entities: [__dirname + '/modules/**/*.entity.ts'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsTableName: 'backend_migrations',
      }),
    }),
  ],
})
export class DatabaseModule {}
