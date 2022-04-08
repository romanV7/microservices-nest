include Makefile-variables

all: | ${NODE_ENV}

############# envs
local: | docker-build docker-up test-db-migrate test
dev: | docker-build docker-up
prod: | docker-build docker-up

############## docker compose
docker-build:
	docker-compose ${COMPOSE_FILE_OPTION} build

docker-up:
	docker-compose ${COMPOSE_FILE_OPTION} up -d --force-recreate

docker-down:
	docker-compose ${COMPOSE_FILE_OPTION} down -v

############## migrations
test-db-migrate:
	docker-compose ${COMPOSE_FILE_OPTION} exec ${COMPOSE_EXEC_OPTIONS} app sh -c "cd $(DOCKER_APP_WORKDIR) && npm run test-migration:run"

############## tests
test:
	docker-compose ${COMPOSE_FILE_OPTION} exec ${COMPOSE_EXEC_OPTIONS} app sh -c "cd $(DOCKER_APP_WORKDIR) && npm run test --maxWorkers=4"
