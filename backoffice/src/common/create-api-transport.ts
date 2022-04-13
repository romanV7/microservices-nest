import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices'

export function createApiTransport(options): ClientProxy {
  return ClientProxyFactory.create({ options })
}
