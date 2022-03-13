export const messages = {
  authorization: {
    register: (code: number) =>
      `Welcome to the application. To confirm the email address, enter confirmation code: ${code}`,
    resetPassword: (code: string) =>
      `To reset password, enter confirmation code: ${code}`,
  },
  errors: {
    emailConfirmed: 'Email already confirmed',
    invalidConfirmationToken: 'Bad confirmation token',
    invalidCredentialsCombination:
      'This email, password combination was not found',
    userExists: 'User with that email already exists',
    userNotFound: 'User does not exists',
    userNotAuthorized: 'Login first',
    emailNotConfimed: 'Confirm your email first',
  },
}
