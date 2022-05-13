import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator'
import { StreamType } from '../../../common'
import {
  StreamArchieveUrl,
  StreamInboundUrl,
  StreamOutboundUrl,
  StreamTitle,
} from '../decorators'

export class UpdateStreamDto {
  @IsString()
  @StreamTitle()
  title: string

  @IsDate()
  scheduledFor: Date

  @Type(() => Number)
  @IsNumber()
  scheduledDuration: number

  @IsEnum(StreamType)
  type: StreamType

  @StreamInboundUrl()
  inboundUrl: string

  @IsString()
  @StreamOutboundUrl()
  outboundUrl: string

  @IsString()
  @StreamArchieveUrl()
  archiveUrl: string

  @Type(() => Number)
  @IsNumber()
  maxViewersCount: number
}
