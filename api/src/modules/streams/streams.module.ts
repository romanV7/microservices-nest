import { Module } from '@nestjs/common'
import { StreamsService } from './streams.service'
import { StreamsController } from './streams.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StreamEntity } from './streams.entity'
import {
  BaseHttpConnectorService,
  provideConstantValue,
  DigitalOceanStreamProviderService,
} from '../../providers'

@Module({
  imports: [TypeOrmModule.forFeature([StreamEntity])],
  controllers: [StreamsController],
  providers: [
    StreamsService,
    DigitalOceanStreamProviderService,
    BaseHttpConnectorService,
    provideConstantValue<string>('STREAM_PROVIDER_URL', 'streamProvider.url'),
    provideConstantValue<number>(
      'STREAM_PROVIDER_REQUEST_TIMEOUT',
      'streamProvider.requestTimeout',
    ),
    provideConstantValue<string>(
      'STREAM_PROVIDER_USERNAME',
      'streamProvider.username',
    ),
    provideConstantValue<string>(
      'STREAM_PROVIDER_PASSWORD',
      'streamProvider.password',
    ),
  ],
  exports: [StreamsService],
})
export class StreamsModule {}
