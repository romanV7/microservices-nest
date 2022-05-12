import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { KnexModule } from 'nest-knexjs'

@Module({
  imports: [
    KnexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'postgres',
          version: '13.5',
          useNullAsDefault: true,
          connection: {
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            username: configService.get<string>('database.user'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.database'),
          },
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
