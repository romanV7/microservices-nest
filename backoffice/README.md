## Running the app

### development mode

- set env variables in the configuration file `src/config/env/development.env`
- database is shared with payment microservice
- set redis `docker-compose.yaml`
- run dockerfile named `Dockerfile.development`

### production mode

- set env variables in the configuration file `src/config/env/production.env`
- database is shared with payment microservice
- set redis `docker-compose.yaml`
- run dockerfile named `Dockerfile.production`
