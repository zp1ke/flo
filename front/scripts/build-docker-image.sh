#!/bin/sh

cd "$(dirname "$0")/.."

docker build -t zp1ke/flo-web:latest .
