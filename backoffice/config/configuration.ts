import * as path from 'path'

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: Number(process.env.APP_PORT),
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: Number(process.env.JWT_EXPIRATION_TIME),
  },
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  testDatabase: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    ttl: Number(process.env.CACHE_TTL),
  },
  mailerSettings: {
    from: process.env.EMAIL_ACCOUNT,
    username: process.env.EMAIL_ACCOUNT,
    password: process.env.EMAIL_PASSWORD,
    smtp: process.env.EMAIL_SMTP,
  },
  streamProvider: {
    url: process.env.STREAM_PROVIDER_HOST,
    username: process.env.STREAM_PROVIDER_USERNAME,
    password: process.env.STREAM_PROVIDER_PASSWORD,
    requestTimeout: Number(process.env.HTTP_REQUEST_TIMEOUT),
  },
  fixturesPath: path.join(process.env.PWD, '/src', '/fixtures'),
  api: {
    host: process.env.API_TRANSPORT_HOST,
    port: Number(process.env.API_TRANSPORT_PORT),
  },
})
