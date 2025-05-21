#!/bin/sh

cd "$(dirname "$0")/.."

jenv local

./gradlew flo-api:bootJar

cd flo-api
docker build -t zp1ke/flo-api:latest .
