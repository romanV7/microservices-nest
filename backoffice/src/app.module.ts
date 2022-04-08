import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database.module'
import { UsersModule } from './modules/users/users.module'
import { configuration } from './config/configuration'
import { AuthenticationModule } from './modules/authentication/authentication.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
  ],
})
export class AppModule {}
