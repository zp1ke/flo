#!/bin/sh

cd "$(dirname "$0")/.."

# Build the API Docker image
sh backend/scripts/build-api-docker-image.sh

# Build the Frontend Docker image
sh front/scripts/build-docker-image.sh
