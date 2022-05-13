import { Injectable } from '@nestjs/common'
import { StreamProviderUrls } from '../constants'
import { ICreateStreamParams, IDeleteStreamParams } from '../interfaces'
import { AbstractStreamProviderService } from './abstract-stream-provider.service'

@Injectable()
export class DigitalOceanStreamProviderService extends AbstractStreamProviderService {
  private readonly createUrl: string = StreamProviderUrls.create

  private readonly deleteUrl: string = StreamProviderUrls.delete

  public async create(params: ICreateStreamParams): Promise<unknown> {
    return this.baseHttpConnectorService.request({
      method: 'post',
      url: this.createUrl,
      data: params,
      auth: {
        username: this.username,
        password: this.password,
      },
    })
  }

  public async delete(params: IDeleteStreamParams): Promise<unknown> {
    return this.baseHttpConnectorService.request({
      method: 'delete',
      url: `${this.deleteUrl}/${params.streamId}/${params.streamerId}`,
      auth: {
        username: this.username,
        password: this.password,
      },
    })
  }

  public async login(username: string, password: string): Promise<void> {}

  public async logout(params: unknown): Promise<void> {}
}
