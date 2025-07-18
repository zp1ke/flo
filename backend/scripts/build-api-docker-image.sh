#!/bin/sh

cd "$(dirname "$0")/.."

jenv local

./gradlew flo-api:bootJar

cd flo-api
docker buildx build -t ghcr.io/zp1ke/flo-api:latest .
