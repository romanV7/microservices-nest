import { Entity, Column } from 'typeorm'
import { AbstractEntity, StreamStatus, StreamType } from '../../common'
import { IntervalTransformer } from './interval.transformer'

@Entity('streams')
export class StreamEntity extends AbstractEntity {
  @Column({ nullable: false })
  title: string

  @Column({ type: 'timestamp', nullable: true })
  scheduledFor: Date

  @Column({
    type: 'interval',
    nullable: true,
    transformer: new IntervalTransformer(),
  })
  scheduledDuration: number

  @Column({
    type: 'interval',
    nullable: true,
    transformer: new IntervalTransformer(),
  })
  actualDuration: number

  @Column({ type: 'enum', enum: StreamType, default: StreamType.Regular })
  type: StreamType

  @Column({ nullable: true })
  inboundUrl: string

  @Column({ nullable: true })
  outboundUrl: string

  @Column({ nullable: true })
  archiveUrl: string

  @Column({ type: 'int', nullable: false })
  maxViewersCount: number

  @Column({ type: 'enum', enum: StreamStatus, default: StreamStatus.Created })
  status: StreamStatus

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  activationInitiatedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  activationCompletedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  deactivationInitiatedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  deactivationCompletedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date

  @Column({ nullable: false })
  userId: string
}
