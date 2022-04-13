import { Module } from '@nestjs/common'
import { StreamsService } from './streams.service'
import { StreamsController } from './streams.controller'
import { RedisCacheModule } from '../redis/redis-cache.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [RedisCacheModule, UsersModule],
  controllers: [StreamsController],
  providers: [StreamsService],
  exports: [StreamsService],
})
export class StreamsModule {}
