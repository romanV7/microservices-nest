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
            host: configService.get<string>('testDatabase.host'),
            port: configService.get<number>('testDatabase.port'),
            username: configService.get<string>('testDatabase.user'),
            password: configService.get<string>('testDatabase.password'),
            database: configService.get<string>('testDatabase.database'),
          },
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
