# Builder container
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /builder

ARG JAR_FILE=build/libs/*.jar

COPY ${JAR_FILE} app.jar

RUN java -Djarmode=tools -jar app.jar extract --layers --destination extracted

# Runtime container
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /builder/extracted/dependencies/ ./
COPY --from=builder /builder/extracted/spring-boot-loader/ ./
COPY --from=builder /builder/extracted/snapshot-dependencies/ ./
COPY --from=builder /builder/extracted/application/ ./

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
