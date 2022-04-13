import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StreamsService } from './streams.service'
import { MessagePattern } from '@nestjs/microservices'
import {
  createEntityCommand,
  EEntityNames,
  EntityOperation,
  IUser,
} from '../../common'
import { ICompleteStream, ICreateStream, IUpdateStream } from './interfaces'

@Controller('streams')
@ApiTags('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @MessagePattern({
    cmd: createEntityCommand(EEntityNames.STREAM, EntityOperation.ADD),
  })
  createTransport(createStreamDto: ICreateStream) {
    return this.streamsService.create(createStreamDto)
  }

  @MessagePattern({
    cmd: createEntityCommand(EEntityNames.STREAM, EntityOperation.DELETE),
  })
  removeTransport(streamId: string) {
    return this.streamsService.remove(streamId)
  }

  @MessagePattern({
    cmd: createEntityCommand(EEntityNames.STREAM, EntityOperation.UPDATE),
  })
  updateTransport({
    entityId,
    updateEntityDto,
  }: { entityId: string } & {
    updateEntityDto: IUpdateStream
  }) {
    return this.streamsService.update(entityId, updateEntityDto)
  }

  @MessagePattern({
    cmd: createEntityCommand(EEntityNames.STREAM, EntityOperation.FIND_BY_ID),
  })
  findOneTransport(streamId: string) {
    return this.streamsService.findOne(streamId)
  }

  @MessagePattern({
    cmd: createEntityCommand(EEntityNames.STREAM, EntityOperation.INITIATE),
  })
  initiateTransport({
    entityId,
    user,
  }: { entityId: string } & {
    user: IUser
  }) {
    return this.streamsService.initiate(entityId, user.id)
  }

  @MessagePattern({
    cmd: createEntityCommand(EEntityNames.STREAM, EntityOperation.COMPLETE),
  })
  completeTransport({
    entityId,
    completeStreamDto,
  }: { entityId: string } & {
    completeStreamDto: ICompleteStream
  }) {
    return this.streamsService.complete(entityId, completeStreamDto)
  }

  @MessagePattern({
    cmd: createEntityCommand(EEntityNames.STREAM, EntityOperation.START),
  })
  startTransport(streamId: string) {
    return this.streamsService.start(streamId)
  }

  @MessagePattern({
    cmd: createEntityCommand(EEntityNames.STREAM, EntityOperation.STOP),
  })
  stopTransport(streamId: string) {
    return this.streamsService.stop(streamId)
  }

  @MessagePattern({
    cmd: createEntityCommand(
      EEntityNames.STREAM,
      EntityOperation.DEACTIVATION_INITIATE,
    ),
  })
  deactivationInitiateTransport({
    entityId,
    user,
  }: { entityId: string } & {
    user: IUser
  }) {
    return this.streamsService.deactivationInitiate(entityId, user.id)
  }

  @MessagePattern({
    cmd: createEntityCommand(
      EEntityNames.STREAM,
      EntityOperation.DEACTIVATION_COMPLETE,
    ),
  })
  completeDeactivationTransport(streamId: string) {
    return this.streamsService.deactivationComplete(streamId)
  }
}
