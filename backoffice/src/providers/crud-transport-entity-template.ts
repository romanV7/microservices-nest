import { ClientProxy } from '@nestjs/microservices'
import { EEntityNames, EntityOperation, createEntityCommand } from '../common'
import { Observable } from 'rxjs'

export class CrudTransportEntityTemplate {
  constructor(
    public readonly clientProxy: ClientProxy,
    public readonly apiName: EEntityNames,
  ) {
    console.log({ clientProxy, apiName })
  }

  findAllTransportPaginated<T>(query = {}): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.GET_ALL_PAGINATED),
      query,
    )
  }

  findAllTransport<T>(query = {}): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.GET_ALL),
      query,
    )
  }

  findOneTransport<T>(entityId): Observable<T> {
    console.log({
      cnd: createEntityCommand(this.apiName, EntityOperation.FIND_BY_ID),
      entityId,
      c: this.clientProxy,
    })
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.FIND_BY_ID),
      entityId,
    )
  }

  createTransport<T>(entity): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.ADD),
      entity,
    )
  }

  updateTransport<T>(entityId, updateEntityDto): Observable<T> {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.UPDATE),
      { entityId, updateEntityDto },
    )
  }

  removeTransport(entityId) {
    return this.clientProxy.send(
      createEntityCommand(this.apiName, EntityOperation.DELETE),
      entityId,
    )
  }
}
