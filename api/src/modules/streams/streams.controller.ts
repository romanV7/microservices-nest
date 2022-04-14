import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StreamsService } from './streams.service'
import { MessagePattern } from '@nestjs/microservices'
import { IUser } from '../../common'
import { ICompleteStream, ICreateStream, IUpdateStream } from './interfaces'

@Controller('streams')
@ApiTags('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @MessagePattern({
    cmd: 'add-stream',
  })
  createTransport(createStreamDto: ICreateStream) {
    return this.streamsService.create(createStreamDto)
  }

  @MessagePattern({
    cmd: 'delete-stream',
  })
  removeTransport(streamId: string) {
    return this.streamsService.remove(streamId)
  }

  @MessagePattern({
    cmd: 'update-stream',
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
    cmd: 'find-by-id-stream',
  })
  findOneTransport(streamId: string) {
    return this.streamsService.findOne(streamId)
  }

  @MessagePattern({
    cmd: 'initiate-stream',
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
    cmd: 'complete-stream',
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
    cmd: 'start-stream',
  })
  startTransport(streamId: string) {
    return this.streamsService.start(streamId)
  }

  @MessagePattern({
    cmd: 'stop-stream',
  })
  stopTransport(streamId: string) {
    return this.streamsService.stop(streamId)
  }

  @MessagePattern({
    cmd: 'deactivation-initiate-stream',
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
    cmd: 'deactivation-complete-stream',
  })
  completeDeactivationTransport(streamId: string) {
    return this.streamsService.deactivationComplete(streamId)
  }
}
