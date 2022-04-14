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
    updateStream: `streams in the ${StreamStatus.Created} status can be updated only`,
    invalidStreamTitle:
      'Stream title provided is not valid. Opponents should be separated by "vs" string. For example, "Team01 vs Team02"',
    completeStream: `streams in the ${StreamStatus.Activating} status can be completed only`,
    startStream: `streams in the ${StreamStatus.Activated} status can be started only`,
    invalidStreamInboundUrl: 'stream inbound url should start with "srt://"',
    invalidStreamOutboundUrl:
      'stream outbound url should start with "https://" and end with ".m3u8"',
    stopStream: `streams in the ${StreamStatus.Started} status can be stopped only`,
    initiateStreamDeactivation: `streams in the ${StreamStatus.Stopped} status can be deactivating only`,
    initiateStreamActivation: `streams in the ${StreamStatus.Created} status can be activated only`,
    invalidStreamArchieveUrl: 'archive url is not valid',
    deactivateCompleteStream: `streams in the ${StreamStatus.Deactivating} status can be initiated only`,
    invalidStreamStatuses: (invalidStatuses: string) =>
      `Invalid stream statuses provided "${invalidStatuses}". Allowed statuses ${Object.values(
        StreamStatus,
      )}`,
    invalidStreamScheduledFor: `stream scheduled for shouldn't be less the current time`,
    invalidStreamScheduledDuration: (minStreamDurationMinutes: number) =>
      `should be more than ${minStreamDurationMinutes} minutes`,
  },
}
