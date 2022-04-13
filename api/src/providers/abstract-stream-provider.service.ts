import { Inject, Injectable } from '@nestjs/common'
import { ICreateStreamParams, IDeleteStreamParams } from '../common'
import { BaseHttpConnectorService } from './base-http-connector.service'

@Injectable()
export abstract class AbstractStreamProviderService {
  public readonly username: string

  public readonly password: string

  constructor(
    public readonly baseHttpConnectorService: BaseHttpConnectorService,
    @Inject('STREAM_PROVIDER_URL') streamProviderUrl: string,
    @Inject('STREAM_PROVIDER_REQUEST_TIMEOUT')
    streamProviderRequestTimeout: number,
    @Inject('STREAM_PROVIDER_USERNAME') streamProviderUsername: string,
    @Inject('STREAM_PROVIDER_PASSWORD') streamProviderPassword: string,
  ) {
    this.baseHttpConnectorService.init({
      baseURL: streamProviderUrl,
      headers: {},
      timeout: streamProviderRequestTimeout,
    })

    this.username = streamProviderUsername
    this.password = streamProviderPassword
  }

  public abstract create(params: ICreateStreamParams): Promise<unknown>

  public abstract delete(params: IDeleteStreamParams): Promise<unknown>

  public abstract login(username: string, password: string): Promise<void>

  public abstract logout(params: unknown): Promise<void>
}
