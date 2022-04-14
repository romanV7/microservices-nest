import * as request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { HttpStatus } from '@nestjs/common'
import { UserDto } from '../dto'
import { ErrorTypeEnum, messages, SuccessResponse } from '../../../common'
import { TestHelper, bootstrap, SeedsHelper } from '../../../test-utils'

describe('AdminsController', () => {
  let testHelper: TestHelper
  let seedsHelper: SeedsHelper
  let confirmedUserAccessToken: string
  let unConfirmedUserAccessToken: string

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

      const unConfirmedUserLoginResponse = await request(testHelper.httpServer)
        .post('/auth/login')
        .send({
          email: 'unconfirmed@user.com',
          password: 'password',
        })

      unConfirmedUserAccessToken = unConfirmedUserLoginResponse.body.accessToken
    })

    describe('Password changing:', () => {
      it('Should change password for confirmed user', async () => {
        const confirmedUserResponse = await request(testHelper.httpServer)
          .get('/me')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const confirmedUser: UserDto = confirmedUserResponse.body

        const response = await request(testHelper.httpServer)
          .post(`/admin/users/${confirmedUser.id}/password/change`)
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
        const confirmedUserResponse = await request(testHelper.httpServer)
          .get('/me')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const confirmedUser: UserDto = confirmedUserResponse.body

        const response = await request(testHelper.httpServer)
          .post(`/admin/users/${confirmedUser.id}/password/change`)
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
        const confirmedUserResponse = await request(testHelper.httpServer)
          .get('/me')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const confirmedUser: UserDto = confirmedUserResponse.body

        const response = await request(testHelper.httpServer)
          .post(`/admin/users/${confirmedUser.id}/password/change`)
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
        const confirmedUserResponse = await request(testHelper.httpServer)
          .get('/me')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const confirmedUser: UserDto = confirmedUserResponse.body

        const response = await request(testHelper.httpServer)
          .post(`/admin/users/${confirmedUser.id}/password/change`)
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

      const unConfirmedUserLoginResponse = await request(testHelper.httpServer)
        .post('/auth/login')
        .send({
          email: 'unconfirmed@user.com',
          password: 'password',
        })

      unConfirmedUserAccessToken = unConfirmedUserLoginResponse.body.accessToken
    })

    describe('Getting users list:', () => {
      it('Should respond with the data of the users list', async () => {
        const response = await request(testHelper.httpServer)
          .get('/admin/users')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const users: UserDto[] = response.body

        expect(response.body).toBeDefined()
        expect(response.statusCode).toEqual(HttpStatus.OK)

        expect(JSON.stringify(users)).toEqual(
          JSON.stringify([
            {
              id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcbu1',
              firstName: 'Bob',
              lastName: 'Davidson',
              enabled: true,
              status: 'UNCONFIRMED',
              email: 'unconfirmed@user.com',
              role: 'STREAMER',
            },
            {
              id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcbu2',
              firstName: 'John',
              lastName: 'Smith',
              enabled: true,
              status: 'CONFIRMED',
              email: 'confirmed@user.com',
              role: 'STREAMER',
            },
          ]),
        )
      })

      it('Should respond with forbidden error for unconfirmed user', async () => {
        const response = await request(testHelper.httpServer)
          .get('/admin/users')
          .set('Authorization', `Bearer ${unConfirmedUserAccessToken}`)

        expect(response).toBeAsExpectedResponse(HttpStatus.FORBIDDEN, {
          error: {
            properties: [
              {
                property: messages.errors.emailNotConfimed,
                errors: [ErrorTypeEnum.INVALID_CREDENTIALS],
              },
            ],
          },
        })
      })

      it('Should respond with unauthorized error for not logged-in user', async () => {
        const response = await request(testHelper.httpServer).get(
          '/admin/users',
        )

        expect(response).toBeAsExpectedResponse(HttpStatus.UNAUTHORIZED, {
          error: {
            common: ['Unauthorized'],
          },
        })
      })
    })

    describe('Getting user by id:', () => {
      it('Should respond with the data of the user', async () => {
        const confirmedUserResponse = await request(testHelper.httpServer)
          .get('/me')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const confirmedUser: UserDto = confirmedUserResponse.body

        const response = await request(testHelper.httpServer)
          .get(`/admin/users/${confirmedUser.id}`)
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const user: UserDto = response.body

        expect(response.body).toBeDefined()
        expect(response.statusCode).toEqual(HttpStatus.OK)

        expect(user.id).toBe(confirmedUser.id)

        expect(user).toMatchObject({
          id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcbu2',
          firstName: 'John',
          lastName: 'Smith',
          enabled: true,
          status: 'CONFIRMED',
          email: 'confirmed@user.com',
          role: 'STREAMER',
        })
      })

      it('Should respond with forbidden error for unconfirmed user', async () => {
        const confirmedUserResponse = await request(testHelper.httpServer)
          .get('/me')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const confirmedUser: UserDto = confirmedUserResponse.body

        const response = await request(testHelper.httpServer)
          .get(`/admin/users/${confirmedUser.id}`)
          .set('Authorization', `Bearer ${unConfirmedUserAccessToken}`)

        expect(response).toBeAsExpectedResponse(HttpStatus.FORBIDDEN, {
          error: {
            properties: [
              {
                property: messages.errors.emailNotConfimed,
                errors: [ErrorTypeEnum.INVALID_CREDENTIALS],
              },
            ],
          },
        })
      })

      it('Should respond with not found error for not existing user id', async () => {
        const response = await request(testHelper.httpServer)
          .get(`/admin/users/${uuidv4()}`)
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        expect(response).toBeAsExpectedResponse(HttpStatus.NOT_FOUND, {
          error: {
            properties: [
              {
                property: messages.errors.userNotFound,
                errors: [ErrorTypeEnum.USER_NOT_FOUND],
              },
            ],
          },
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
