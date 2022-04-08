# Streaming API

## Deployment

### Requirements

- `docker` version 19 and above;
- `docker-compose` version 1.23 and above;

<br />

### Steps

`make local` - call to initialize local environment
`make dev` - call to initialize dev environment
`make prod` - call to initialize prod environment

Project should be accessible by [http://localhost:3000](http://localhost:3000) by default.
Port can be changed in src/config/env/development.env or src/config/env/production.env file by setting of `APP_PORT` variable.
Documentation should be accessible by [http://localhost:3000/api/documentation](http://localhost:3000/api/documentation) by default.
Migrations run on application start. Before deployment copy env file `cp .env.dist .env`

<br />

### Available Environments

- `dev` - load fixtures, run tests on dockerized `test` database, unload fixtures;
- `prod` - tests and fixtures won't be ran;

See `Makefile-variables` file to see environment variable values related to chosen environment.

<br />

### Make commands

Full list of commands can be found in the `Makefile` itself.
Here are some commands:

- `make test-db-migrate` - run migrations on test database;
- `make test` - run tests on test database;
