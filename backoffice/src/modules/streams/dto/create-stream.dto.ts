import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { StreamTitle } from '../decorators'
import { StreamType } from '../../../common'

export class CreateStreamDto {
  @IsString()
  @IsNotEmpty()
  @StreamTitle()
  title: string

  @IsDate()
  @IsNotEmpty()
  scheduledFor: Date

  @IsEnum(StreamType)
  type: StreamType = StreamType.Regular

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  maxViewersCount: number
}
