export interface ICreateStream {
  readonly title: string
  readonly scheduledFor: Date
  readonly type: string
  readonly maxViewersCount: number
  readonly userId: string
}
