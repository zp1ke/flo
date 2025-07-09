# Flo - Personal Finance Management Platform

A comprehensive personal finance management platform built as a modern monorepo with a Java Spring Boot backend, React frontend, and email templates.

[![Backend Test](https://github.com/zp1ke/flo/actions/workflows/backend-test.yml/badge.svg)](https://github.com/zp1ke/flo/actions/workflows/backend-test.yml)

## 🏗️ Project Structure

This monorepo contains the following main components:

```
flo/
├── backend/           # Java Spring Boot API (Multi-module Gradle project)
│   ├── flo-api/       # REST API endpoints and web layer
│   ├── flo-data/      # Data access layer and domain models
│   ├── flo-tools/     # Shared tools and utilities
│   └── flo-utils/     # Common utilities and helper classes
├── front/             # React.js frontend application
├── email/             # React Email templates
├── docker/            # Docker composition files
├── images/            # Project assets and logos
└── scripts/           # Build and deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- **Java 21** - For backend development
- **Node.js 18+** - For frontend and email template development
- **Docker & Docker Compose** - For containerized deployment
- **PostgreSQL** - Database (can be run via Docker)

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd flo
   ```

2. **Start the database:**
   ```bash
   cd docker
   docker-compose up postgres -d
   ```

3. **Run the backend:**
   ```bash
   cd backend
   ./gradlew :flo-api:bootRun
   ```

4. **Run the frontend:**
   ```bash
   cd front
   npm install
   npm run dev
   ```

5. **Preview email templates (optional):**
   ```bash
   cd email
   npm install
   npm run dev
   ```

### Production Deployment

Build and deploy the entire stack using Docker:

```bash
# Build all Docker images
./scripts/build-docker-images.sh

# Deploy the full stack
cd docker
docker-compose up -d
```

## 📦 Components

### Backend (`/backend`)
- **Technology:** Java 21, Spring Boot 3.x, Gradle Multi-module
- **Database:** PostgreSQL with Liquibase migrations
- **Features:** REST API, JWT authentication, background jobs, OpenAPI documentation
- **Modules:**
  - `flo-api`: Web layer with REST endpoints
  - `flo-data`: Data access and domain models
  - `flo-tools`: Shared tools and utilities
  - `flo-utils`: Common utilities and helpers

### Frontend (`/front`)
- **Technology:** React 19, TypeScript, Vite, React Router 7
- **UI:** Tailwind CSS, shadcn/ui components
- **Features:** Modern financial dashboard, transaction tracking, wallet management
- **State Management:** Zustand
- **Testing:** Cypress E2E tests
- **i18n:** Multi-language support with react-i18next

### Email Templates (`/email`)
- **Technology:** React Email
- **Purpose:** Transactional email templates (verification, recovery, etc.)
- **Development:** Live preview server for template development

## 🔧 Development

### Backend Development
```bash
cd backend

# Build the project
./gradlew build

# Run tests
./gradlew test

# Run the API server
./gradlew :flo-api:bootRun

# Generate OpenAPI docs (available at /api/v1/docs/ui.html)
```

### Frontend Development
```bash
cd front

# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run E2E tests
npm run cy:open

# Build for production
npm run build
```

### Email Development
```bash
cd email

# Install dependencies
npm install

# Start preview server
npm run dev

# Build templates
npm run build
```

## 🐳 Docker & Deployment

The project includes Docker configurations for all components:

- **Backend:** Multi-stage build with OpenJDK 21
- **Frontend:** Nginx-based serving with optimized build
- **Database:** PostgreSQL with persistent storage
- **Full Stack:** Docker Compose orchestration

Services are configured with health checks and proper dependency management.

## 📚 API Documentation

Once the backend is running, API documentation is available at:
- **Swagger UI:** `http://localhost:8080/api/v1/docs/ui.html`
- **OpenAPI JSON:** `http://localhost:8080/api/v1/docs`

## 🛠️ Built With

### Backend Stack
- Java 21 & Spring Boot 3.x
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Liquibase
- JobRunr (Background Jobs)
- Lombok
- Gradle Multi-module

### Frontend Stack
- React 19 & TypeScript
- React Router 7
- Tailwind CSS & shadcn/ui
- Zustand (State Management)
- Axios (HTTP Client)
- React Hook Form & Zod
- Recharts (Data Visualization)
- Vite (Build Tool)

### DevOps & Tools
- Docker & Docker Compose
- Gradle (Backend Build)
- Vite (Frontend Build)
- Cypress (E2E Testing)
- GitHub Actions (CI/CD)
- Biome (Linting & Formatting)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
