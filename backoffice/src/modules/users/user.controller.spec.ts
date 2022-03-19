import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'

import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TestDatabaseModule } from '../../test-database.module'
import { configuration } from '../../config/configuration'

describe('UserController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/src/config/env/${
            process.env.NODE_ENV
          }.env`,
          isGlobal: true,
          load: [configuration],
        }),
        TestDatabaseModule,
        TypeOrmModule.forFeature([UserEntity]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
