require('dotenv').config({
  path: `src/config/env/${process.env.NODE_ENV}.env`,
})
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

module.exports = [
  {
    name: 'migrations',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [
      'src/modules/**/*.entity{.ts,.js}',
      'src/common/*.entity{.ts,.js}',
    ],
    migrations: ['src/migrations/*{.ts,.js}'],
    migrationsTableName: 'backend_migrations',
    cli: {
      migrationsDir: 'src/migrations/',
    },
    namingStrategy: new SnakeNamingStrategy(),
  },
  {
    name: 'migrations-test',
    type: 'postgres',
    host: process.env.TEST_DB_HOST,
    port: +process.env.TEST_DB_PORT,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [
      'src/modules/**/*.entity{.ts,.js}',
      'src/common/*.entity{.ts,.js}',
    ],
    migrations: ['src/migrations/*{.ts,.js}'],
    migrationsTableName: 'backend_migrations',
    cli: {
      migrationsDir: 'src/migrations/',
    },
    namingStrategy: new SnakeNamingStrategy(),
  },
  {
    name: 'seeds-test',
    type: 'postgres',
    host: process.env.TEST_DB_HOST,
    port: +process.env.TEST_DB_PORT,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [
      'src/modules/**/*.entity{.ts,.js}',
      'src/common/*.entity{.ts,.js}',
    ],
    migrations: ['src/seeds/*{.ts,.js}'],
    migrationsTableName: 'backend_seeds',
    cli: {
      migrationsDir: 'src/seeds/',
    },
    namingStrategy: new SnakeNamingStrategy(),
  },
]
