import { ConfigService } from '@nestjs/config'
import { createApiTransport, EEntityNames } from '../common'
import { CrudTransportEntityTemplate } from './crud-transport-entity-template'

export class TcpApiTransport extends CrudTransportEntityTemplate {
  public static readonly configService: ConfigService = new ConfigService()

  public static readonly tcpAdapter = createApiTransport({
    host: TcpApiTransport.configService.get<string>('api.host'),
    port: 4000, //TcpApiTransport.configService.get<number>('api.port'),
  })

  constructor(public readonly apiName: EEntityNames) {
    super(TcpApiTransport.tcpAdapter, apiName)
  }
}
