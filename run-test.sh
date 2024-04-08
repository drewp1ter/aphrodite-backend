#!/bin/bash
export NODE_ENV=test
export DB_NAME=test
export DB_PORT=3308
export DEBUG=false

MYSQL_DATA_DIR=/dev/shm/mysql
CONTAINER_NAME=mysql_test

mkdir ${MYSQL_DATA_DIR}
docker run --rm -d \
  -e MYSQL_DATABASE=${DB_NAME} \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -p ${DB_PORT}:3306 \
  -v ${MYSQL_DATA_DIR}:/var/lib/mysql \
  --name ${CONTAINER_NAME} \
  --user $UID:$GID \
  mysql:8.3

while true; do
    echo "waiting for the database to start..."
    if [ -d "${MYSQL_DATA_DIR}/${DB_NAME}" ]; then
      break
    fi
    sleep 1
done

yarn test:watch
docker stop ${CONTAINER_NAME}
rm -rf ${MYSQL_DATA_DIR}
