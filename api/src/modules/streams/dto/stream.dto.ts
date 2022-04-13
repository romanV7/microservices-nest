import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { StreamStatus, StreamType, AbstractDto } from '../../../common'

export class StreamDto extends AbstractDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsDate()
  @IsNotEmpty()
  scheduledFor: Date

  @IsNumber()
  scheduledDuration: number

  @IsNumber()
  actualDuration: number

  @IsEnum(StreamType)
  type: StreamType

  @IsString()
  inboundUrl: string

  @IsString()
  outboundUrl: string

  @IsString()
  archiveUrl: string

  @IsNumber()
  maxViewersCount: number

  @IsEnum(StreamStatus)
  status: StreamStatus

  @IsDate()
  startedAt: Date

  @IsDate()
  activationInitiatedAt: Date

  @IsDate()
  activationCompletedAt: Date

  @IsDate()
  deactivationInitiatedAt: Date

  @IsDate()
  deactivationCompletedAt: Date

  constructor(stream) {
    super(stream)
    this.title = stream.title
    this.scheduledFor = stream.scheduledFor
    this.scheduledDuration = stream.scheduledDuration
    this.actualDuration = stream.actualDuration
    this.type = stream.type
    this.inboundUrl = stream.inboundUrl
    this.outboundUrl = stream.outboundUrl
    this.archiveUrl = stream.archiveUrl
    this.maxViewersCount = stream.maxViewersCount
    this.status = stream.status
    this.startedAt = stream.startedAt
    this.activationInitiatedAt = stream.activationInitiatedAt
    this.activationCompletedAt = stream.activationCompletedAt
    this.deactivationInitiatedAt = stream.deactivationInitiatedAt
    this.deactivationCompletedAt = stream.deactivationCompletedAt
  }
}
