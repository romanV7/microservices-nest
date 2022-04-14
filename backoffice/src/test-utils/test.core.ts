import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TestDatabaseModule } from '../test-database.module'
import { configuration } from '../config/configuration'
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express'
import { HttpExceptionFilter } from '../filters'
import { ResponseErrorTypeEnum, errorParser } from '../common'
import { UsersModule } from '../modules/users/users.module'
import { AuthenticationModule } from '../modules/authentication/authentication.module'
import { EmailService } from '../providers'
import { mockEmailService } from './helpers'

export async function bootstrap() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
      }),
      TestDatabaseModule,
      UsersModule,
      AuthenticationModule,
    ],
  })
    .overrideProvider(EmailService)
    .useValue(mockEmailService)
    .compile()

  const app: INestApplication = module.createNestApplication<
    NestExpressApplication
  >(new ExpressAdapter(), {
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

  app.useGlobalPipes(validationPipe).useGlobalFilters(httpExceptionFilter)

  return app.init()
}
