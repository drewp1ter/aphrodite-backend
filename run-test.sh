#!/bin/bash
export NODE_ENV=test
export DB_NAME=test
export DB_PORT=3308

MYSQL_DATA_DIR=/dev/shm/mysql
CONTAINER_NAME=mysql_test

mkdir ${MYSQL_DATA_DIR}
docker stop ${CONTAINER_NAME} 2>/dev/null
docker run --rm -d \
  -e MYSQL_DATABASE=${DB_NAME} \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -p ${DB_PORT}:3306 \
  -v ${MYSQL_DATA_DIR}:/var/lib/mysql \
  --name ${CONTAINER_NAME} \
  --user $UID:$GID \
  mysql:8.3

echo "Building application..."
npx nest build

while true; do
    echo "Waiting for the database to start..."
    if [ -d "${MYSQL_DATA_DIR}/${DB_NAME}" ]; then
      break
    fi
    sleep 1
done
sleep 1
npx mikro-orm migration:up --config ./dist/mikro-orm.config.js
npx jest --watch --config=jest.json -w1
docker stop ${CONTAINER_NAME}
rm -rf ${MYSQL_DATA_DIR}
