import { StreamStatus } from './constants'

export const messages = {
  errors: {
    streamNotFound: 'User does not exists',
    updateStream: `streams in the ${StreamStatus.Created} status can be updated only`,
    invalidStreamTitle:
      'Stream title provided is not valid. Opponents should be separated by "vs" string. For example, "Team01 vs Team02"',
    completeStream: `streams in the ${StreamStatus.Activating} status can be completed only`,
    startStream: `streams in the ${StreamStatus.Activated} status can be started only`,
    invalidStreamInboundUrl: 'stream inbound url should start with "srt://"',
    invalidStreamOutboundUrl:
      'stream outbound url should start with "https://" and end with ".m3u8"',
    stopStream: `streams in the ${StreamStatus.Started} status can be stopped only`,
    deactivatingStream: `streams in the ${StreamStatus.Stopped} status can be deactivating only`,
    initiateStream: `streams in the ${StreamStatus.Created} status can be initiated only`,
    invalidStreamArchieveUrl: 'archive url is not valid',
    deactivateCompleteStream: `streams in the ${StreamStatus.Deactivating} status can be initiated only`,
  },
}
