import { IsString } from 'class-validator'

export class SuccessResponse {
  @IsString()
  message: string
}
