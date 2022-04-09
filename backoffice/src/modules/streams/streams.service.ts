import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { UserEntity } from '../users/user.entity'
import {
  createError,
  ErrorTypeEnum,
  messages,
  StreamStatus,
} from '../../common'
import {
  CompleteStreamDto,
  CreateStreamDto,
  StreamDto,
  UpdateStreamDto,
} from './dto'
import { StreamEntity } from './streams.entity'
import { DigitalOceanStreamProviderService } from '../../providers/digital-ocean-stream-provider.service'
import { StreamStatusTransitionService } from '../../providers'

@Injectable()
export class StreamsService {
  constructor(
    @InjectRepository(StreamEntity)
    private streamRepository: Repository<StreamEntity>,
    private readonly digitalOceanStreamProviderService: DigitalOceanStreamProviderService,
    private readonly configService: ConfigService,
  ) {}

  create(
    createStreamDto: CreateStreamDto,
    user: UserEntity,
  ): Promise<StreamEntity> {
    return this.streamRepository.save({
      ...createStreamDto,
      status: StreamStatus.Created,
      user,
    })
  }

  remove(id: string) {
    return this.streamRepository.delete({ id })
  }

  async findOne(id: string): Promise<StreamDto> {
    const stream = await this.streamRepository.findOne(id)

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

  async update(
    id: string,
    updateStreamDto: Partial<StreamDto>,
  ): Promise<StreamEntity> {
    const property = await this.findOne(id)

    if (property.status !== StreamStatus.Created) {
      throw new BadRequestException(
        createError(ErrorTypeEnum.UPDATE_STREAM, messages.errors.updateStream),
      )
    }

    return this.streamRepository.save({
      ...property,
      ...updateStreamDto,
    })
  }

  async initiate(id: string, userId: string): Promise<StreamEntity> {
    const stream = await this.findOne(id)

    const canUpdateStatus = StreamStatusTransitionService.validateTransition(
      stream.status,
      StreamStatus.Activating,
    )

    if (!canUpdateStatus) {
      throw new ConflictException(
        createError(
          ErrorTypeEnum.INITIATE_STREAM,
          messages.errors.initiateStream,
        ),
      )
    }

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
    completeStreamDto: CompleteStreamDto,
  ): Promise<StreamEntity> {
    const property = await this.findOne(id)

    const canUpdateStatus = StreamStatusTransitionService.validateTransition(
      property.status,
      StreamStatus.Activated,
    )

    if (!canUpdateStatus) {
      throw new ConflictException(
        createError(
          ErrorTypeEnum.COMPLETE_STREAM,
          messages.errors.completeStream,
        ),
      )
    }

    return this.streamRepository.save({
      ...property,
      ...completeStreamDto,
      activationCompletedAt: new Date(),
      status: StreamStatus.Activated,
    })
  }

  async start(id: string): Promise<StreamEntity> {
    const property = await this.findOne(id)

    const canUpdateStatus = StreamStatusTransitionService.validateTransition(
      property.status,
      StreamStatus.Started,
    )

    if (!canUpdateStatus) {
      throw new ConflictException(
        createError(ErrorTypeEnum.START_STREAM, messages.errors.startStream),
      )
    }

    return this.streamRepository.save({
      ...property,
      status: StreamStatus.Started,
      startedAt: new Date(),
    })
  }

  async stop(id: string): Promise<StreamEntity> {
    const property = await this.findOne(id)

    const canUpdateStatus = StreamStatusTransitionService.validateTransition(
      property.status,
      StreamStatus.Stopped,
    )

    if (!canUpdateStatus) {
      throw new ConflictException(
        createError(ErrorTypeEnum.STOP_STREAM, messages.errors.stopStream),
      )
    }

    return this.streamRepository.save({
      ...property,
      status: StreamStatus.Stopped,
    })
  }

  async getByOptions(params: Partial<StreamEntity>): Promise<StreamEntity> {
    return this.streamRepository.findOne(params)
  }

  async findAll(): Promise<StreamEntity[]> {
    return this.streamRepository.find()
  }

  async deactivationInitiate(
    id: string,
    userId: string,
  ): Promise<StreamEntity> {
    const stream = await this.findOne(id)

    const canUpdateStatus = StreamStatusTransitionService.validateTransition(
      stream.status,
      StreamStatus.Deactivating,
    )

    if (!canUpdateStatus) {
      throw new ConflictException(
        createError(
          ErrorTypeEnum.DEACTIVATING_STREAM,
          messages.errors.deactivatingStream,
        ),
      )
    }

    await this.digitalOceanStreamProviderService.delete({
      streamId: stream.id,
      streamerId: userId,
    })

    return this.streamRepository.save({
      ...stream,
      status: StreamStatus.Deactivating,
      deactivationInitiatedAt: new Date(),
    })
  }

  async deactivationComplete(id: string): Promise<StreamEntity> {
    const property = await this.findOne(id)

    const canUpdateStatus = StreamStatusTransitionService.validateTransition(
      property.status,
      StreamStatus.Deactivated,
    )

    if (!canUpdateStatus) {
      throw new ConflictException(
        createError(
          ErrorTypeEnum.DEACTIVATE_COMPELTE_STREAM,
          messages.errors.deactivateCompleteStream,
        ),
      )
    }

    return this.streamRepository.save({
      ...property,
      status: StreamStatus.Deactivated,
      deactivationCompletedAt: new Date(),
    })
  }
}
