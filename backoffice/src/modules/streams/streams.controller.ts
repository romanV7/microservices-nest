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

@Controller('streams')
@ApiTags('streams')
@UseGuards(JwtAuthenticationGuard, TokenBlackListGuard, EmailConfirmationGuard)
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Post()
  async create(
    @Body() createStreamDto: CreateStreamDto,
    @User() user: UserEntity,
  ): Promise<StreamDto> {
    return this.streamsService.create(createStreamDto, user)
  }

  @Delete(':streamId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('streamId') streamId: string) {
    return this.streamsService.remove(streamId)
  }

  @Patch(':streamId')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('streamId') streamId: string,
    @Body() updateStreamDto: UpdateStreamDto,
  ): Promise<StreamDto> {
    return this.streamsService.update(streamId, updateStreamDto)
  }

  @Get(':streamId')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('streamId') streamId: string): Promise<StreamDto> {
    return this.streamsService.findOne(streamId)
  }

  @Post(':streamId/activation/initiate')
  @HttpCode(HttpStatus.ACCEPTED)
  async initiate(
    @Param('streamId') streamId: string,
    @User() user: UserEntity,
  ): Promise<StreamDto> {
    return this.streamsService.initiate(streamId, user.id)
  }

  @Post(':streamId/activation/complete')
  @HttpCode(HttpStatus.OK)
  async complete(
    @Param('streamId') streamId: string,
    @Body() completeStreamDto: CompleteStreamDto,
  ): Promise<StreamDto> {
    return this.streamsService.complete(streamId, completeStreamDto)
  }

  @Post(':streamId/start')
  @HttpCode(HttpStatus.OK)
  async start(@Param('streamId') streamId: string): Promise<StreamDto> {
    return this.streamsService.start(streamId)
  }

  @Post(':streamId/stop')
  @HttpCode(HttpStatus.OK)
  async stop(@Param('streamId') streamId: string): Promise<StreamDto> {
    return this.streamsService.stop(streamId)
  }

  @Post(':streamId/deactivation/initiate')
  @HttpCode(HttpStatus.OK)
  async deactivationInitiate(
    @Param('streamId') streamId: string,
    @User() user: UserEntity,
  ): Promise<StreamDto> {
    return this.streamsService.deactivationInitiate(streamId, user.id)
  }

  @Post(':streamId/deactivation/complete')
  @HttpCode(HttpStatus.OK)
  async completeDeactivation(
    @Param('streamId') streamId: string,
  ): Promise<StreamDto> {
    return this.streamsService.deactivationComplete(streamId)
  }
}
