# Flo Backend

## Overview
Expense tracker backend project.


## Project Structure
The project is organized into the following modules:

- **flo-utils**: Contains common utilities and helper classes.
- **flo-data**: Handles data access and domain models using Postgres.
- **flo-api**: Exposes the REST API and handles HTTP requests.

## Requirements
- Java 21
- Gradle (multi-module)
- Spring Boot 3.x.x
- Postgres

## Getting Started

### Prerequisites
- Java 21 installed
- Gradle installed (or use the Gradle wrapper)

### Build the Project
To build the project, navigate to the root directory and run:
```
./gradlew build
```

### Run the Application
To run the application, use the following command:
```
./gradlew :flo-api:bootRun
```

## Testing
Unit tests are included for each module. To run the tests, execute:
```
./gradlew test
```

## CI/CD
Continuous Integration is set up using GitHub Actions for automated testing.

## OpenAPI Documentation
The API documentation is generated using Springdoc OpenAPI. You can access the documentation at:
```
<base-url>/api/v1/docs/ui.html
```
