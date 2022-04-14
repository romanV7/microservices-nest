#!/bin/bash

set -e
set -u

function create_database_extentions() {
	local database=$1
	echo "Creating database extentions'$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        \c $database;
        CREATE EXTENSION IF NOT EXISTS"uuid-ossp";
        SELECT * FROM pg_extension;

EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation extentions requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		create_database_extentions $db
	done
	echo "Multiple databases extentions created"
fi