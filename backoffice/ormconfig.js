require('dotenv')

module.exports = [
  {
    name: 'migrations',
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
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
  },
  {
    name: 'seeds',
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
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
  },
]
