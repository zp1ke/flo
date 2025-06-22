# Flo/front

A modern, scalable web application for financial management. Features include dashboards, user authentication, transaction tracking, wallet management, and category organization. Built with React, TypeScript, Vite, Zustand, shadcn/ui, Tailwind CSS, and more.

## Features

- 📊 Financial dashboards
- 🔐 User authentication
- 💸 Transaction tracking
- 👛 Wallet management
- 🏷️ Category organization
- 🌐 Internationalization (i18next)
- 🧩 Component-driven UI (shadcn/ui, Tailwind CSS)
- ⚡ Fast development with Vite
- 🗂️ State management with Zustand
- 📋 Data tables with @tanstack/react-table
- 🧪 End-to-end testing with Cypress
- 🐳 Docker-ready for deployment
- 📝 TypeScript throughout
- 🌍 Routing with React Router
- 🧹 Formatting and linting with Biome

## Getting Started

### Installation

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Type Checking & Linting

Run type checking and code generation:

```bash
npm run typecheck
```

Run formatting and linting:

```bash
npm run format
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Testing

Run all Cypress end-to-end tests:

```bash
npx cypress run
```

## Deployment

### Docker

Build and run with Docker:

```bash
docker build -t zp1ke/flo-web:latest .
docker run -p 3000:3000 flo-front
```

### DIY Deployment

Deploy the output of `npm run build` from the `build/client` directory to your preferred static hosting or container platform.

## Project Structure

- `app/` — Main application source code
  - `api/` — API client modules
  - `components/` — UI and layout components
  - `contexts/` — React context providers
  - `hooks/` — Custom React hooks
  - `lib/` — Utilities and helpers
  - `routes/` — Route components and folders
  - `store/` — Zustand stores
  - `types/` — TypeScript type definitions
- `build/` — Build output
- `cypress/` — Cypress tests and support
- `public/` — Static assets
- `scripts/` — Utility scripts
- `Dockerfile`, `nginx.conf` — Docker/server config
- `package.json`, `tsconfig.json`, `vite.config.ts` — Project config

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for a modern, flexible UI. You can extend or customize the styling as needed.
