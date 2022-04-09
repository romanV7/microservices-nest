import { IPostgresInterval } from 'postgres-interval'
import { ValueTransformer } from 'typeorm'
import * as moment from 'moment'

export class IntervalTransformer implements ValueTransformer {
  to(seconds: number): string {
    return seconds && `${seconds} seconds`
  }

  from(interval: IPostgresInterval): number {
    if (!interval) {
      return null
    }
    const isoDuration = interval.toISOString()

    const duration = moment.duration(isoDuration)

    return duration.asSeconds()
  }
}
