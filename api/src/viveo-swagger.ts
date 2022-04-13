import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'
import { v } from './version.json'

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('BackOffice API')
    .setVersion(v)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api/documentation', app, document)
}
