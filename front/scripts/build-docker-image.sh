#!/bin/sh

cd "$(dirname "$0")/.."

docker buildx build -t ghcr.io/zp1ke/flo-app:latest .
