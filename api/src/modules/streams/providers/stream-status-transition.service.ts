import { StreamStatus, IStreamStatusMap } from '../common'

export class StreamStatusTransitionService {
  private static streamStatusMap: IStreamStatusMap = {
    [StreamStatus.Created]: [StreamStatus.Activating],
    [StreamStatus.Activating]: [StreamStatus.Activated],
    [StreamStatus.Activated]: [StreamStatus.Started],
    [StreamStatus.Started]: [StreamStatus.Stopped, StreamStatus.Deactivating],
    [StreamStatus.Stopped]: [StreamStatus.Deactivating],
    [StreamStatus.Deactivating]: [StreamStatus.Deactivated],
  }

  static validateTransition(
    streamStatus: StreamStatus,
    statusTransition: StreamStatus,
  ): boolean {
    const allowedTransitions = this.streamStatusMap[streamStatus]

    return !!allowedTransitions?.includes(statusTransition)
  }
}
