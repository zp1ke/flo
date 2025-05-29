#!/bin/sh

cd "$(dirname "$0")/.."

jenv local

SPRING_PROFILES_ACTIVE=dev ./gradlew :flo-api:bootRun
