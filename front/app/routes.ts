import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  layout('components/layout/auth-layout.tsx', [route('dashboard', 'routes/dashboard.tsx')]),
] satisfies RouteConfig;
