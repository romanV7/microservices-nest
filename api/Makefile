include Makefile-variables

all: | ${NODE_ENV}

############# envs
development: | docker-build docker-up
production: | docker-build docker-up

############## docker compose
docker-build:
	docker-compose ${COMPOSE_FILE_OPTION} build

docker-up:
	docker-compose ${COMPOSE_FILE_OPTION} up -d --force-recreate

docker-down:
	docker-compose ${COMPOSE_FILE_OPTION} down -v
