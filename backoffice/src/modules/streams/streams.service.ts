import { Injectable } from '@nestjs/common'
import {
  createEntityCommand,
  EEntityNames,
  EntityOperation,
} from '../../common'
import { CompleteStreamDto } from './dto'
import { TcpApiTransport } from '../../providers/tcp-api-transport'
import { Observable } from 'rxjs'

@Injectable()
export class StreamsService extends TcpApiTransport {
  constructor() {
    super(EEntityNames.STREAM)
  }

  initiateTransport<T>(id: string, userId: string): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.INITIATE),
      { id, userId },
    )
  }

  completeTransport<T>(
    id: string,
    completeStreamDto: CompleteStreamDto,
  ): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.COMPLETE),
      { id, completeStreamDto },
    )
  }

  startTransport<T>(id: string): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.START),
      { id },
    )
  }

  stopTransport<T>(id: string): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.STOP),
      { id },
    )
  }

  deactivationInitiateTransport<T>(id: string, userId: string): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.DEACTIVATION_INITIATE),
      { id, userId },
    )
  }

  deactivationCompleteTransport<T>(id: string): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.DEACTIVATION_COMPLETE),
      { id },
    )
  }
}
