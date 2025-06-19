# GitHub Copilot Instructions for flo/front

## Project Overview
This project is a modern web application for financial management, featuring dashboards, user authentication, transaction tracking, wallet management, and category organization. The frontend is built with React and TypeScript, using Vite for fast development and build processes. State management is handled with Zustand, and the UI leverages a component-driven approach with custom and third-party components. Routing is managed by React Router. The project is designed for scalability, maintainability, and a great user experience.

## Technologies Used
- **React** (with hooks)
- **TypeScript**
- **Vite** (build tool)
- **Zustand** (state management)
- **@tanstack/react-table** (data tables)
- **React Router** (routing)
- **shadcn/ui** (UI component library)
- **Tailwind CSS** (utility-first CSS framework)
- **Cypress** (end-to-end testing)
- **Docker** (containerization)
- **i18next** (internationalization)
- **Biome** (formatting and linting)

## Code Standards
- Use TypeScript for all code (no plain JS files)
- Prefer functional components and React hooks
- Use explicit typing for props, state, and function signatures
- Organize code by feature/domain (e.g., routes, components, store)
- Use consistent naming conventions (camelCase for variables/functions, PascalCase for components/types)
- Keep components small and focused; extract logic into hooks or utility functions when possible
- Use async/await for asynchronous code
- Write clear, concise, and meaningful comments where necessary
- Follow Biome rules for formatting and linting

## Testing Before Commit
**Always run the full test suite and format/lint before making a commit.**
- Run any available unit or integration tests
- Manually verify critical user flows if possible
- Ensure the application builds without errors:
  ```sh
  npm run build
  ```
- Run Biome for formatting and linting:
  ```sh
  npm run format
  ```
- Run React Router code generation and type checking:
  ```sh
  npm run typecheck
  ```
- Do not commit if any test fails, if there are TypeScript errors, or if formatting/linting fails

## Project Structure Summary
- `app/` — Main application source code
  - `api/` — API client modules (auth, categories, profiles, transactions, wallets)
  - `components/` — Reusable UI and layout components (form, table, layout, animate-ui, etc.)
  - `contexts/` — React context providers (e.g., theme)
  - `hooks/` — Custom React hooks
  - `lib/` — Utility and helper functions (i18n, general utils)
  - `routes/` — Route components and route-specific folders
  - `store/` — Zustand stores for app state (category, data-table, transaction, user, wallet)
  - `types/` — TypeScript type definitions (auth, category, page, profile, transaction, user, wallet, etc.)
- `build/` — Build output (client assets, static files)
- `cypress/` — Cypress end-to-end tests, fixtures, and support files
- `public/` — Public static assets (favicon, locales, etc.)
- `scripts/` — Utility scripts (e.g., Docker build)
- `Dockerfile`, `nginx.conf` — Docker and server configuration
- `package.json`, `tsconfig.json`, `vite.config.ts` — Project configuration files

---
**Note:** Keep this file up to date as the project evolves. For any questions, refer to the README or ask the project maintainers.
