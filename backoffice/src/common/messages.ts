import { StreamStatus } from './constants'

export const messages = {
  authorization: {
    register: (code: number) =>
      `Welcome to the application. To confirm the email address, enter confirmation code: ${code}`,
    resetPassword: (code: string) =>
      `To reset password, enter confirmation code: ${code}`,
    registrationConfirmed: 'Email has been confirmed successfully',
    passwordResetConfirmed: 'Password has been confirmed successfully',
    logout: 'ok',
  },
  user: {
    changePassword: 'Success! Your password has been changed',
  },
  errors: {
    emailConfirmed: 'Email already confirmed',
    invalidConfirmationToken: 'Bad confirmation token',
    invalidCredentialsCombination:
      'This email, password combination was not found',
    userExists: 'User with that email already exists',
    userNotFound: 'User does not exists',
    tokenBlacklisted: 'Relogin first',
    emailNotConfimed: 'Confirm your email first',
    wrongOldPassword: 'Wrong old password',
    wrongNewPasswordComparation: 'Wrong new password comparation',
    transitionNotAllowed: (streamStatus, transitionStatus) =>
      `Transition from stream status ${streamStatus} to ${transitionStatus} not allowed`,
    streamNotFound: 'User does not exists',
    updateStream: `streams in the ${StreamStatus.Created} status can be updated only`,
  },
}
