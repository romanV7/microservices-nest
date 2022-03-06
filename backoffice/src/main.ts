import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'
import { setupSwagger } from 'viveo-swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService: ConfigService = app.get(ConfigService)

  if (configService.get<string>('NODE_ENV') === 'development') {
    setupSwagger(app)
  }

  const port = configService.get<number>('port')

  await app.listen(port)
}
bootstrap()
