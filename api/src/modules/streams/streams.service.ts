import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

import {
  createError,
  ErrorTypeEnum,
  messages,
  StreamStatus,
} from '../../common'
import { DigitalOceanStreamProviderService } from '../../providers/digital-ocean-stream-provider.service'
import { StreamStatusTransitionService } from '../../providers'
import { ICompleteStream, StreamDto } from './interfaces'

@Injectable()
export class StreamsService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly digitalOceanStreamProviderService: DigitalOceanStreamProviderService,
    private readonly configService: ConfigService,
  ) {}

  create(createStreamDto): Promise<StreamDto> {
    return this.knex.table('streams').insert({
      ...createStreamDto,
      status: StreamStatus.Created,
    })
  }

  remove(id: string) {
    return this.knex
      .table('users')
      .where('id', id)
      .del()
  }

  async findOne(id: string): Promise<StreamDto> {
    const stream = await this.knex.table('streams').where('id', id)

    if (!stream) {
      throw new NotFoundException(
        createError(
          ErrorTypeEnum.STREAM_NOT_FOUND,
          messages.errors.streamNotFound,
        ),
      )
    }

    return new StreamDto(stream)
  }

  async update(id: string, updateStreamDto): Promise<StreamDto> {
    const property = await this.findOne(id)

    if (property.status !== StreamStatus.Created) {
      throw new BadRequestException(
        createError(ErrorTypeEnum.UPDATE_STREAM, messages.errors.updateStream),
      )
    }

    return this.knex.table('streams').insert({
      ...property,
      ...updateStreamDto,
    })
  }

  protected validateStream(
    status: StreamStatus,
    expectedStatus: StreamStatus,
    error,
  ): void {
    const canUpdateStatus = StreamStatusTransitionService.validateTransition(
      status,
      expectedStatus,
    )

    if (!canUpdateStatus) {
      throw new ConflictException(createError(error.key, error.value))
    }
  }

  async initiate(id: string, userId: string): Promise<StreamDto> {
    const stream = await this.findOne(id)

    this.validateStream(stream.status, StreamStatus.Activating, {
      key: ErrorTypeEnum.INITIATE_STREAM,
      value: messages.errors.initiateStream,
    })

    await this.digitalOceanStreamProviderService.create({
      streamId: stream.id,
      streamerId: userId,
      environment: this.configService.get<string>('NODE_ENV'),
      hosts: stream.maxViewersCount,
      duration: stream.scheduledDuration,
    })

    return this.update(id, {
      status: StreamStatus.Activating,
      activationInitiatedAt: new Date(),
    })
  }

  async complete(
    id: string,
    completeStreamDto: ICompleteStream,
  ): Promise<StreamDto> {
    const property = await this.findOne(id)

    this.validateStream(property.status, StreamStatus.Activated, {
      key: ErrorTypeEnum.COMPLETE_STREAM,
      value: messages.errors.completeStream,
    })

    return this.knex.table('streams').insert({
      ...property,
      ...completeStreamDto,
      activationCompletedAt: new Date(),
      status: StreamStatus.Activated,
    })
  }

  async start(id: string): Promise<StreamDto> {
    const property = await this.findOne(id)

    this.validateStream(property.status, StreamStatus.Started, {
      key: ErrorTypeEnum.START_STREAM,
      value: messages.errors.startStream,
    })

    return this.knex.table('streams').insert({
      ...property,
      status: StreamStatus.Started,
      startedAt: new Date(),
    })
  }

  async stop(id: string): Promise<StreamDto> {
    const property = await this.findOne(id)

    this.validateStream(property.status, StreamStatus.Stopped, {
      key: ErrorTypeEnum.STOP_STREAM,
      value: messages.errors.stopStream,
    })

    return this.knex.table('streams').insert({
      ...property,
      status: StreamStatus.Stopped,
    })
  }

  async getByOptions(params: Partial<StreamDto>): Promise<StreamDto> {
    return this.knex.table('streams').where('id', params)
  }

  async findAll(): Promise<StreamDto[]> {
    return this.knex.table('streams')
  }

  async deactivationInitiate(id: string, userId: string): Promise<StreamDto> {
    const stream = await this.findOne(id)

    this.validateStream(stream.status, StreamStatus.Deactivating, {
      key: ErrorTypeEnum.DEACTIVATING_STREAM,
      value: messages.errors.deactivatingStream,
    })

    await this.digitalOceanStreamProviderService.delete({
      streamId: stream.id,
      streamerId: userId,
    })

    return this.knex.table('streams').insert({
      ...stream,
      status: StreamStatus.Deactivating,
      deactivationInitiatedAt: new Date(),
    })
  }

  async deactivationComplete(id: string): Promise<StreamDto> {
    const property = await this.findOne(id)

    this.validateStream(property.status, StreamStatus.Deactivated, {
      key: ErrorTypeEnum.DEACTIVATE_COMPELTE_STREAM,
      value: messages.errors.deactivateCompleteStream,
    })

    return this.knex.table('streams').insert({
      ...property,
      status: StreamStatus.Deactivated,
      deactivationCompletedAt: new Date(),
    })
  }
}
