import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import { IHttpRequestConfig } from '../common/interfaces/http-request-config.interface'
import { createError, ErrorTypeEnum } from '../common'
import { HttpConnector } from '../common/helpers/http-connector'

@Injectable()
export class BaseHttpConnectorService {
  protected httpConnector: HttpConnector

  init(config: IHttpRequestConfig) {
    this.httpConnector = new HttpConnector(config)
  }

  public async request<T>(params: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse = await this.httpConnector.request<T>(
        params,
      )
      return response.data
    } catch (error) {
      this.processError(error)
    }
  }

  processError(error: AxiosError) {
    console.error('[HttpClient/processError]: ', error)

    const response = error?.response

    if (response) {
      const { status, data } = response

      switch (status) {
        case HttpStatus.BAD_REQUEST:
          throw new BadRequestException(
            createError(ErrorTypeEnum.AXIOS_ERROR, data.message),
          )
        case HttpStatus.UNAUTHORIZED:
          throw new UnauthorizedException(
            createError(ErrorTypeEnum.AXIOS_ERROR, data.message),
          )
        case HttpStatus.FORBIDDEN:
          throw new ForbiddenException(
            createError(ErrorTypeEnum.AXIOS_ERROR, data.message),
          )
        default:
          throw new InternalServerErrorException(
            createError(
              ErrorTypeEnum.AXIOS_ERROR,
              error.message || response.data.message,
            ),
          )
      }
    } else {
      throw new ServiceUnavailableException(
        createError(ErrorTypeEnum.AXIOS_ERROR, error.message),
      )
    }
  }
}
