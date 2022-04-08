import * as request from 'supertest'
import { HttpStatus } from '@nestjs/common'
import { omit } from 'lodash'
import { UserDto } from '../users/dto'
import { ErrorTypeEnum, messages, SuccessResponse } from '../../common'
import { LoginResponse, RegisterDto, ResetPasswordDto } from './dto'
import { TestHelper, bootstrap, SeedsHelper } from '../../test-utils'

describe('AuthenticationController', () => {
  let testHelper: TestHelper
  let seedsHelper: SeedsHelper
  let confirmedUserAccessToken: string

  beforeAll(async () => {
    testHelper = new TestHelper(await bootstrap())
    seedsHelper = new SeedsHelper(testHelper.getConnection())
  })

  describe('POST, PUT, PATCH, DELETE endpoints:', () => {
    beforeEach(async () => {
      await seedsHelper.createTestUsers()

      const payload = await testHelper.initBaseData()

      confirmedUserAccessToken = payload.confirmedUserAccessToken
    })

    describe('Authentication login:', () => {
      it('Should login user', async () => {
        const response = await request(testHelper.httpServer)
          .post('/auth/login')
          .send({
            email: 'confirmed@user.com',
            password: 'password',
          })

        const loginResponse: LoginResponse = response.body

        expect(response.body).toBeDefined()
        expect(loginResponse.accessToken).toBeDefined()
        expect(loginResponse.tokenType).toEqual('Bearer')
        expect(response.statusCode).toEqual(HttpStatus.OK)
      })

      it('Should login with email written in different character case e.g Confirmed@user.com', async () => {
        const response = await request(testHelper.httpServer)
          .post('/auth/login')
          .send({
            email: 'Confirmed@user.com',
            password: 'password',
          })

        const loginResponse: LoginResponse = response.body

        expect(response.body).toBeDefined()
        expect(loginResponse.accessToken).toBeDefined()
        expect(loginResponse.tokenType).toEqual('Bearer')
        expect(response.statusCode).toEqual(HttpStatus.OK)
      })

      it('Should login with email written in different character case e.g cOnfirmed@user.com', async () => {
        const response = await request(testHelper.httpServer)
          .post('/auth/login')
          .send({
            email: 'cOnfirmed@user.com',
            password: 'password',
          })

        const loginResponse: LoginResponse = response.body

        expect(response.body).toBeDefined()
        expect(loginResponse.accessToken).toBeDefined()
        expect(loginResponse.tokenType).toEqual('Bearer')
        expect(response.statusCode).toEqual(HttpStatus.OK)
      })

      it('Should not login with wrong email and valid password', async () => {
        const response = await request(testHelper.httpServer)
          .post('/auth/login')
          .send({
            email: 'uknown@user.com',
            password: 'password',
          })

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

      it('Should not login with invalid email and valid password', async () => {
        const response = await request(testHelper.httpServer)
          .post('/auth/login')
          .send({
            email: 'user.com',
            password: 'password',
          })

        expect(response).toBeAsExpectedResponse(HttpStatus.BAD_REQUEST, {
          error: {
            properties: [
              {
                property: 'email',
                errors: ['email is not valid'],
              },
            ],
          },
        })
      })

      it('Should not login user with "login" key in payload instead of "email" key', async () => {
        const response = await request(testHelper.httpServer)
          .post('/auth/login')
          .send({
            login: 'confirmed@user.com',
            password: 'password',
          })

        expect(response).toBeAsExpectedResponse(HttpStatus.BAD_REQUEST, {
          error: {
            properties: [
              {
                property: 'login',
                errors: ['property login should not exist'],
              },
              {
                property: 'email',
                errors: [
                  'email should not be null or undefined',
                  'email is not valid',
                  'email should not be empty',
                  'email must be a string',
                ],
              },
            ],
          },
        })
      })
    })

    describe('Authentication registration:', () => {
      it('Should register user and confirm email', async () => {
        const registrationData: RegisterDto = {
          email: 'jake@user.com',
          password: 'password',
        }

        const response = await request(testHelper.httpServer)
          .post(`/auth/register`)
          .send(registrationData)

        const user: UserDto = response.body

        expect(response.body).toBeDefined()

        expect(omit(user, ['id'])).toMatchObject({
          status: 'UNCONFIRMED',
          email: 'jake@user.com',
          role: 'STREAMER',
        })

        expect(response.statusCode).toEqual(HttpStatus.CREATED)

        const redisKey = `register:${registrationData.email}`

        const code = await testHelper.getCodeByKey(redisKey)

        const confirmResponse = await request(testHelper.httpServer)
          .post('/auth/register/confirm')
          .send({
            email: 'jake@user.com',
            code,
          })

        const successResponse: SuccessResponse = confirmResponse.body

        expect(confirmResponse.body).toBeDefined()
        expect(successResponse.message).toEqual(
          messages.authorization.registrationConfirmed,
        )
        expect(confirmResponse.statusCode).toEqual(HttpStatus.OK)
      })

      it('Should not register user with invalid email during registration', async () => {
        const registrationData: RegisterDto = {
          email: 'testuser.com',
          password: 'password',
        }

        const response = await request(testHelper.httpServer)
          .post(`/auth/register`)
          .send(registrationData)

        expect(response).toBeAsExpectedResponse(HttpStatus.BAD_REQUEST, {
          error: {
            properties: [
              {
                property: 'email',
                errors: ['email is not valid'],
              },
            ],
          },
        })
      })

      it('Should not register user with empty password during registration;', async () => {
        const registrationData: RegisterDto = {
          email: 'new@user.com',
          password: '',
        }

        const response = await request(testHelper.httpServer)
          .post(`/auth/register`)
          .send(registrationData)

        expect(response).toBeAsExpectedResponse(HttpStatus.BAD_REQUEST, {
          error: {
            properties: [
              {
                property: 'password',
                errors: [
                  'password must be longer than or equal to 8 characters',
                  'password should not be empty',
                ],
              },
            ],
          },
        })
      })

      it('Should not confirm user with invalid code during confirmation of account', async () => {
        const registrationData: RegisterDto = {
          email: 'peter@user.com',
          password: 'password',
        }

        const response = await request(testHelper.httpServer)
          .post(`/auth/register`)
          .send(registrationData)

        const user: UserDto = response.body

        expect(response.body).toBeDefined()
        expect(user.email).toEqual(registrationData.email)
        expect(response.statusCode).toEqual(HttpStatus.CREATED)

        const code: number = 111

        const confirmResponse = await request(testHelper.httpServer)
          .post('/auth/register/confirm')
          .send({
            email: 'jake@user.com',
            code,
          })

        expect(confirmResponse).toBeAsExpectedResponse(HttpStatus.BAD_REQUEST, {
          error: {
            properties: [
              {
                property: messages.errors.invalidConfirmationToken,
                errors: [ErrorTypeEnum.INVALID_CONFIRMATION_CODE],
              },
            ],
          },
        })
      })

      it('Should not confirm user with different email during confirmation of account', async () => {
        const registrationData: RegisterDto = {
          email: 'david@user.com',
          password: 'password',
        }

        const response = await request(testHelper.httpServer)
          .post(`/auth/register`)
          .send(registrationData)

        const user: UserDto = response.body

        expect(response.body).toBeDefined()
        expect(user.email).toEqual(registrationData.email)
        expect(response.statusCode).toEqual(HttpStatus.CREATED)

        const redisKey = `register:${registrationData.email}`

        const code = await testHelper.getCodeByKey(redisKey)

        const confirmResponse = await request(testHelper.httpServer)
          .post('/auth/register/confirm')
          .send({
            email: 'fake@user.com',
            code,
          })

        expect(confirmResponse).toBeAsExpectedResponse(HttpStatus.BAD_REQUEST, {
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

    describe('Authentication forgot password:', () => {
      it('Should reset password for user', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          email: 'confirmed@user.com',
        }

        const resetPasswordResponse = await request(testHelper.httpServer)
          .post(`/auth/password/reset`)
          .send(resetPasswordDto)

        expect(resetPasswordResponse.body).toBeDefined()
        expect(resetPasswordResponse.statusCode).toEqual(HttpStatus.OK)

        const userResponse = await request(testHelper.httpServer)
          .get('/me')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const user: UserDto = userResponse.body

        expect(userResponse.body).toBeDefined()

        expect(omit(user, ['id'])).toMatchObject({
          firstName: 'John',
          lastName: 'Smith',
          enabled: true,
          status: 'CONFIRMED',
          email: 'confirmed@user.com',
          role: 'STREAMER',
        })

        expect(user.email).toEqual(resetPasswordDto.email)
        expect(userResponse.statusCode).toEqual(HttpStatus.OK)

        const code = await testHelper.getPasswordResetToken(user.id)

        const confirmResponse = await request(testHelper.httpServer)
          .post('/auth/password/reset/confirm')
          .send({
            password: 'password!',
            code,
          })

        const successResponse: SuccessResponse = confirmResponse.body

        expect(confirmResponse.body).toBeDefined()

        expect(successResponse.message).toEqual(
          messages.authorization.passwordResetConfirmed,
        )

        const response = await request(testHelper.httpServer)
          .post('/auth/login')
          .send({
            email: resetPasswordDto.email,
            password: 'password!',
          })

        const loginResponse: LoginResponse = response.body

        expect(response.body).toBeDefined()
        expect(loginResponse.accessToken).toBeDefined()
        expect(loginResponse.tokenType).toEqual('Bearer')
        expect(response.statusCode).toEqual(HttpStatus.OK)
      })

      it('Should not reset password for user with invalid reset password token during confirmation', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          email: 'confirmed@user.com',
        }

        const resetPasswordResponse = await request(testHelper.httpServer)
          .post(`/auth/password/reset`)
          .send(resetPasswordDto)

        expect(resetPasswordResponse.body).toBeDefined()
        expect(resetPasswordResponse.statusCode).toEqual(HttpStatus.OK)

        const userResponse = await request(testHelper.httpServer)
          .get('/me')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const user: UserDto = userResponse.body

        expect(omit(user, ['id'])).toMatchObject({
          firstName: 'John',
          lastName: 'Smith',
          enabled: true,
          status: 'CONFIRMED',
          email: 'confirmed@user.com',
          role: 'STREAMER',
        })

        expect(userResponse.body).toBeDefined()
        expect(userResponse.statusCode).toEqual(HttpStatus.OK)

        const confirmResponse = await request(testHelper.httpServer)
          .post('/auth/password/reset/confirm')
          .send({
            password: 'password!',
            code: 'token',
          })

        expect(confirmResponse).toBeAsExpectedResponse(HttpStatus.BAD_REQUEST, {
          error: {
            properties: [
              {
                property: messages.errors.invalidConfirmationToken,
                errors: [ErrorTypeEnum.INVALID_CONFIRMATION_CODE],
              },
            ],
          },
        })
      })

      it('Should not reset password for user with invalid email in payload', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          email: 'confirmeduser.com',
        }

        const response = await request(testHelper.httpServer)
          .post(`/auth/password/reset`)
          .send(resetPasswordDto)

        expect(response).toBeAsExpectedResponse(HttpStatus.BAD_REQUEST, {
          error: {
            properties: [
              {
                property: 'email',
                errors: ['email is not valid'],
              },
            ],
          },
        })
      })

      it('Should not reset password for user with not existing email in payload', async () => {
        const resetPasswordDto: ResetPasswordDto = { email: 'unknown@user.com' }

        const response = await request(testHelper.httpServer)
          .post(`/auth/password/reset`)
          .send(resetPasswordDto)

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

    describe('Authentication logout:', () => {
      it('Should logout user', async () => {
        const response = await request(testHelper.httpServer)
          .post('/auth/logout')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        const successResponse: SuccessResponse = response.body

        expect(response.body).toBeDefined()
        expect(successResponse.message).toEqual(messages.authorization.logout)
        expect(response.statusCode).toEqual(HttpStatus.OK)

        const currentUserResponse = await request(testHelper.httpServer)
          .get('/me')
          .set('Authorization', `Bearer ${confirmedUserAccessToken}`)

        expect(currentUserResponse).toBeAsExpectedResponse(
          HttpStatus.UNAUTHORIZED,
          {
            error: {
              properties: [
                {
                  property: messages.errors.tokenBlacklisted,
                  errors: [ErrorTypeEnum.TOKEN_BLACKLISTED],
                },
              ],
            },
          },
        )
      })
    })

    afterEach(async () => {
      await testHelper.truncateDatabase()
    })
  })

  afterAll(async () => {
    await testHelper.stopServer()
  })
})
