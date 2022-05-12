import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

export class BaseTestHelper {
  protected readonly app: INestApplication

  constructor(app: INestApplication) {
    this.app = app
  }

  public get httpServer() {
    return this.app.getHttpServer()
  }

  public async initBaseData() {
    const confirmedUserLoginResponse = await request(this.httpServer)
      .post('/auth/login')
      .send({
        email: 'confirmed@user.com',
        password: 'password',
      })

    const confirmedUserAccessToken: string =
      confirmedUserLoginResponse.body.accessToken

    return {
      confirmedUserAccessToken,
    }
  }

  public async stopServer() {
    await this.app.close()
  }
}
