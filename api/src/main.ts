import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { setupSwagger } from 'viveo-swagger'
import { HttpExceptionFilter } from './filters'
import { errorParser, ResponseErrorTypeEnum } from './common'
import { useContainer } from 'typeorm'
import { MicroserviceOptions } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug', 'error', 'log', 'verbose', 'warn'],
  })

  const httpExceptionFilter = new HttpExceptionFilter()

  const validationPipe = new ValidationPipe({
    exceptionFactory: errors =>
      new BadRequestException({
        type: ResponseErrorTypeEnum.SCHEMA_VALIDATION_ERROR,
        errors: errorParser(errors),
      }),
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  })

  const configService: ConfigService = app.get(ConfigService)

  if (configService.get<string>('NODE_ENV') === 'development') {
    setupSwagger(app)
  }

  const port = configService.get<number>('port')

  app.useGlobalPipes(validationPipe).useGlobalFilters(httpExceptionFilter)

  useContainer(app.select(AppModule), {
    fallback: true,
    fallbackOnErrors: true,
  })

  app.connectMicroservice<MicroserviceOptions>({
    options: {
      host: configService.get<number>('api.host'),
      port: configService.get<number>('api.port'),
      retryAttempts: 5,
      retryDelay: 3000,
    },
  })

  console.log({
    host: configService.get<number>('api.host'),
    port: configService.get<number>('api.port'),
    retryAttempts: 5,
    retryDelay: 3000,
  })

  await app.startAllMicroservices()

  await app.listen(port)
}
bootstrap()
