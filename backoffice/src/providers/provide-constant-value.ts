import { ConfigService } from '@nestjs/config'

export const provideConstantValue = <T>(
  provideName: string,
  configPath: string,
) => ({
  provide: provideName,
  useFactory: (configService: ConfigService) =>
    configService.get<T>(configPath),
  inject: [ConfigService],
})
