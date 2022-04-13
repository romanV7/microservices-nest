export interface IUpdateStream {
  readonly title: string
  readonly scheduledFor: Date
  readonly scheduledDuration: number
  readonly type: string
  readonly inboundUrl: string
  readonly outboundUrl: string
  readonly archiveUrl: string
  readonly maxViewersCount: number
}
