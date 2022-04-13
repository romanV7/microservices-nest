require('dotenv')
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
]
