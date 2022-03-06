import { IsDate, IsString } from 'class-validator'

export class AbstractDto {
  @IsString()
  id: string

  @IsDate()
  createdAt: Date

  @IsDate()
  updatedAt: Date
}
