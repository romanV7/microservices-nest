import * as request from 'supertest'
import { HttpStatus } from '@nestjs/common'
import { omit } from 'lodash'
import { UserDto } from '../dto'
import { ErrorTypeEnum, messages, SuccessResponse } from '../../../common'
import { TestHelper, bootstrap, SeedsHelper } from '../../../test-utils'

describe('UsersController', () => {
  let testHelper: TestHelper
  let seedsHelper: SeedsHelper
  let confirmedUserAccessToken: string

  beforeAll(async () => {
    testHelper = new TestHelper(await bootstrap())
    seedsHelper = new SeedsHelper(
      testHelper.getConnection(),
      testHelper.fixturesPath,
    )
  })

  describe('POST, PUT, PATCH, DELETE endpoints:', () => {
    beforeEach(async () => {
      await seedsHelper.loadFixtures()

      const payload = await testHelper.initBaseData()

      confirmedUserAccessToken = payload.confirmedUserAccessToken
    })

    describe('Password changing:', () => {
      it('Should change password for confirmed user', async () => {
        const response = await request(testHelper.httpServer)
          .post(`/me/password/change`)
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)
          .send({
            oldPassword: 'password',
            newPassword: 'password!',
            newPasswordForConfirmation: 'password!',
          })

        const successResponse: SuccessResponse = response.body
        expect(response.body).toBeDefined()
        expect(response.statusCode).toEqual(HttpStatus.OK)
        expect(successResponse.message).toBe(messages.user.changePassword)
      })

      it('Should not change password for user with invalid current password', async () => {
        const response = await request(testHelper.httpServer)
          .post(`/me/password/change`)
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)
          .send({
            oldPassword: 'password123',
            newPassword: 'password!',
            newPasswordForConfirmation: 'password!',
          })

        expect(response).toBeAsExpectedResponse(HttpStatus.FORBIDDEN, {
          error: {
            properties: [
              {
                property: messages.errors.wrongOldPassword,
                errors: [ErrorTypeEnum.USER_INVALID_PASSWORD],
              },
            ],
          },
        })
      })

      it('Should not change password for user with different new passwords', async () => {
        const response = await request(testHelper.httpServer)
          .post(`/me/password/change`)
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)
          .send({
            oldPassword: 'password',
            newPassword: 'password!',
            newPasswordForConfirmation: 'p@ssword!',
          })

        expect(response).toBeAsExpectedResponse(HttpStatus.BAD_REQUEST, {
          error: {
            properties: [
              {
                property: messages.errors.wrongNewPasswordComparation,
                errors: [ErrorTypeEnum.INVALID_CREDENTIALS],
              },
            ],
          },
        })
      })

      it('Should not allow user to login with old password after successful changing of it;', async () => {
        const response = await request(testHelper.httpServer)
          .post(`/me/password/change`)
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)
          .send({
            oldPassword: 'password',
            newPassword: 'password123',
            newPasswordForConfirmation: 'password123',
          })

        const successResponse: SuccessResponse = response.body
        expect(response.body).toBeDefined()
        expect(response.statusCode).toEqual(HttpStatus.OK)
        expect(successResponse.message).toBe(messages.user.changePassword)

        const loginResponse = await request(testHelper.httpServer)
          .post('/auth/login')
          .send({
            email: 'confirmed@user.com',
            password: 'password',
          })

        expect(loginResponse).toBeAsExpectedResponse(HttpStatus.UNAUTHORIZED, {
          error: {
            properties: [
              {
                property: messages.errors.invalidCredentialsCombination,
                errors: [ErrorTypeEnum.INVALID_CREDENTIALS],
              },
            ],
          },
        })
      })
    })

    afterEach(async () => {
      await testHelper.truncateDatabase()
    })
  })

  describe('GET endpoints:', () => {
    beforeAll(async () => {
      await seedsHelper.loadFixtures()

      const payload = await testHelper.initBaseData()

      confirmedUserAccessToken = payload.confirmedUserAccessToken
    })

    describe('Getting current user:', () => {
      it('Should respond with the data of the user', async () => {
        const response = await request(testHelper.httpServer)
          .get(`/me`)
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const user: UserDto = response.body

        expect(response.body).toBeDefined()
        expect(response.statusCode).toEqual(HttpStatus.OK)

        expect(omit(user, ['id'])).toMatchObject({
          firstName: 'John',
          lastName: 'Smith',
          enabled: true,
          status: 'CONFIRMED',
          email: 'confirmed@user.com',
          role: 'STREAMER',
        })
      })
    })

    afterAll(async () => {
      await testHelper.truncateDatabase()
    })
  })

  afterAll(async () => {
    await testHelper.stopServer()
  })
})
