# GitHub Copilot Instructions for flo/backend

## Project Overview
This project is a backend monorepo for the "flo" platform. It is organized as a multi-module Gradle project, primarily written in Java and Kotlin, and is designed to provide scalable APIs, data management, and utility services for the platform.

## Technologies Used
- Java & Kotlin (JVM-based languages)
- Gradle (build automation)
- Docker (containerization)
- Karate (API testing)
- Additional libraries and frameworks as defined in `gradle/libs.versions.toml`

## Code Standards
- Follow standard Java/Kotlin style guides (Google Java Style, Kotlin Coding Conventions).
- Use clear, descriptive names for classes, methods, and variables.
- Write modular, maintainable, and well-documented code.
- Keep code DRY (Don't Repeat Yourself) and SOLID.
- All code must be formatted and linted according to project or language standards before committing.

## Testing Before Commit
**Before making any commit:**
- Run all unit and integration tests using Gradle (`./gradlew test`).
- Ensure all tests pass and no new warnings or errors are introduced.
- If you add or modify features, include or update relevant tests.
- For API changes, run Karate tests in `flo-api`.

## Project Structure Summary
- `flo-api/`      – API service module (REST endpoints, controllers, Karate tests)
- `flo-data/`     – Data access and persistence module
- `flo-utils/`    – Shared utilities and helper functions
- `flo-tools/`    – Tools and scripts for development/maintenance
- `build-logic/`  – Custom Gradle plugins and build logic
- `docker/`       – Docker Compose and container configs
- `scripts/`      – Shell scripts for building and running services
- `gradle/`       – Gradle wrapper and version catalogs
- `build/`        – Build outputs (auto-generated)

## Additional Notes
- Keep dependencies up to date and defined in the version catalog (`gradle/libs.versions.toml`).
- Document any architectural or design decisions in the `README.md`.
- Use meaningful commit messages.

---

**By following these instructions, you help maintain code quality and project consistency.**
