import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  EmailConfirmationGuard,
  JwtAuthenticationGuard,
  TokenBlackListGuard,
} from '../authentication/guard'
import { StreamsService } from './streams.service'
import {
  CompleteStreamDto,
  CreateStreamDto,
  StreamDto,
  UpdateStreamDto,
} from './dto'
import { User } from '../../decorators'
import { UserEntity } from '../users/user.entity'
import { Observable } from 'rxjs'

@Controller('streams')
@ApiTags('streams')
@UseGuards(JwtAuthenticationGuard, TokenBlackListGuard, EmailConfirmationGuard)
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Post()
  create(
    @Body() createStreamDto: CreateStreamDto,
    @User() user: UserEntity,
  ): Observable<StreamDto> {
    return this.streamsService.createTransport<StreamDto>({
      ...createStreamDto,
      user,
    })
  }

  @Delete(':streamId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('streamId') streamId: string) {
    return this.streamsService.removeTransport(streamId)
  }

  @Patch(':streamId')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('streamId') streamId: string,
    @Body() updateStreamDto: UpdateStreamDto,
  ): Observable<StreamDto> {
    return this.streamsService.updateTransport<StreamDto>(
      streamId,
      updateStreamDto,
    )
  }

  @Get(':streamId')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('streamId') streamId: string): Observable<StreamDto> {
    return this.streamsService.findOneTransport<StreamDto>(streamId)
  }

  @Post(':streamId/activation/initiate')
  @HttpCode(HttpStatus.ACCEPTED)
  initiate(
    @Param('streamId') streamId: string,
    @User() user: UserEntity,
  ): Observable<StreamDto> {
    return this.streamsService.initiateTransport<StreamDto>(streamId, user.id)
  }

  @Post(':streamId/activation/complete')
  @HttpCode(HttpStatus.OK)
  complete(
    @Param('streamId') streamId: string,
    @Body() completeStreamDto: CompleteStreamDto,
  ): Observable<StreamDto> {
    return this.streamsService.completeTransport<StreamDto>(
      streamId,
      completeStreamDto,
    )
  }

  @Post(':streamId/start')
  @HttpCode(HttpStatus.OK)
  start(@Param('streamId') streamId: string): Observable<StreamDto> {
    return this.streamsService.startTransport<StreamDto>(streamId)
  }

  @Post(':streamId/stop')
  @HttpCode(HttpStatus.OK)
  stop(@Param('streamId') streamId: string): Observable<StreamDto> {
    return this.streamsService.stopTransport<StreamDto>(streamId)
  }

  @Post(':streamId/deactivation/initiate')
  @HttpCode(HttpStatus.OK)
  deactivationInitiate(
    @Param('streamId') streamId: string,
    @User() user: UserEntity,
  ): Observable<StreamDto> {
    return this.streamsService.deactivationInitiateTransport<StreamDto>(
      streamId,
      user.id,
    )
  }

  @Post(':streamId/deactivation/complete')
  @HttpCode(HttpStatus.OK)
  completeDeactivation(
    @Param('streamId') streamId: string,
  ): Observable<StreamDto> {
    return this.streamsService.deactivationCompleteTransport<StreamDto>(
      streamId,
    )
  }
}
