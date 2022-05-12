# Backoffice API

## General Description
The server that handles requests, domain modeling located here also implemented part of the business logic of the selected subject area, namely streaming service

## Deployment

### Requirements

- `docker` version 19 and above;
- `docker-compose` version 1.23 and above;

<br />

### Steps

`make development` - call to initialize dev environment
`make production` - call to initialize prod environment

Project should be accessible by [http://localhost:3000](http://localhost:3000) by default.
Port can be changed in `.env` file by setting of `APP_PORT` variable.
Documentation should be accessible by [http://localhost:3000/api/documentation](http://localhost:3000/api/documentation) by default.
Migrations run on application start. Before deployment copy env file `cp .env.dev.local .env`

<br />

### Available Environments

- `development` - run tests on dockerized `test` database;
- `production` - tests and fixtures won't be ran;

See `Makefile-variables` file to see environment variable values related to chosen environment.

<br />

### Make commands

Full list of commands can be found in the `Makefile` itself.
Here are some commands:

- `make test-db-migrate` - run migrations on test database;
- `make test` - run tests on test database;
