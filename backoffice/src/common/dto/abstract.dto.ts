import { IsString } from 'class-validator'

export class AbstractDto {
  @IsString()
  id: string

  constructor(dto) {
    this.id = dto.id
  }
}
