import { IsString } from 'class-validator'
import { StreamInboundUrl, StreamOutboundUrl } from '../decorators'

export class CompleteStreamDto {
  @IsString()
  @StreamInboundUrl()
  inboundUrl: string

  @IsString()
  @StreamOutboundUrl()
  outboundUrl: string
}
