import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database.module'
import { configuration } from '../config/configuration'
import { StreamsModule } from './modules/streams/streams.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    StreamsModule,
  ],
})
export class AppModule {}
