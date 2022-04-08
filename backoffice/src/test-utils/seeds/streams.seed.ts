import { StreamStatus, StreamType } from '../../common'
import { StreamEntity } from '../../modules/streams/streams.entity'

export const streams: Partial<StreamEntity>[] = [
  {
    title: '24.01 vs 1',
    scheduledFor: new Date('2020-01-03T01:11:11.111Z'),
    type: StreamType.Regular,
    maxViewersCount: 100000,
    status: StreamStatus.Created,
  },
  {
    title: '24.02 vs 2',
    scheduledFor: new Date('2020-01-03T01:11:11.111Z'),
    type: StreamType.Regular,
    maxViewersCount: 100000,
    status: StreamStatus.Activating,
    activationInitiatedAt: new Date(),
  },
  {
    title: '24.03 vs 3',
    scheduledFor: new Date('2020-01-03T01:11:11.111Z'),
    type: StreamType.Regular,
    inboundUrl: 'srt://292051871.acstreams.com:5050',
    outboundUrl: 'srt://292051872.acstreams.com:5050',
    maxViewersCount: 100000,
    status: StreamStatus.Activated,
    activationCompletedAt: new Date(),
  },
  {
    title: '24.04 vs 4',
    scheduledFor: new Date('2020-01-03T01:11:11.111Z'),
    type: StreamType.Regular,
    inboundUrl: 'srt://292051871.acstreams.com:5050',
    outboundUrl: 'srt://292051872.acstreams.com:5050',
    maxViewersCount: 100000,
    status: StreamStatus.Started,
    startedAt: new Date(),
  },
  {
    title: '24.05 vs 5',
    scheduledFor: new Date('2020-01-03T01:11:11.111Z'),
    type: StreamType.Regular,
    inboundUrl: 'srt://292051871.acstreams.com:5050',
    outboundUrl: 'srt://292051872.acstreams.com:5050',
    maxViewersCount: 100000,
    status: StreamStatus.Stopped,
  },
  {
    title: '24.06 vs 6',
    scheduledFor: new Date('2020-01-03T01:11:11.111Z'),
    type: StreamType.Regular,
    inboundUrl: 'srt://292051871.acstreams.com:5050',
    outboundUrl: 'srt://292051872.acstreams.com:5050',
    maxViewersCount: 100000,
    status: StreamStatus.Deactivating,
    deactivationInitiatedAt: new Date(),
  },
  {
    title: '24.07 vs 7',
    scheduledFor: new Date('2020-01-03T01:11:11.111Z'),
    type: StreamType.Regular,
    inboundUrl: 'srt://292051871.acstreams.com:5050',
    outboundUrl: 'srt://292051872.acstreams.com:5050',
    archiveUrl: '',
    maxViewersCount: 100000,
    status: StreamStatus.Deactivated,
    deactivationCompletedAt: new Date(),
  },
]