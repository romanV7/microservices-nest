import * as path from 'path'

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: Number(process.env.APP_PORT),
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  streamProvider: {
    url: process.env.STREAM_PROVIDER_HOST,
    username: process.env.STREAM_PROVIDER_USERNAME,
    password: process.env.STREAM_PROVIDER_PASSWORD,
    requestTimeout: Number(process.env.HTTP_REQUEST_TIMEOUT),
  },
  api: {
    host: process.env.API_TRANSPORT_HOST,
    port: Number(process.env.API_TRANSPORT_PORT),
  },
})
