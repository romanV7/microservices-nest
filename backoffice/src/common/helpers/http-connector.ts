import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'
import { IHttpRequestConfig } from '../interfaces/http-request-config.interface'

export class HttpConnector {
  private service: AxiosInstance

  constructor(axiosConfig: IHttpRequestConfig) {
    this.service = axios.create(axiosConfig)
  }

  request<T = any>(params: AxiosRequestConfig): AxiosPromise {
    return this.service.request<T>(params)
  }
}
