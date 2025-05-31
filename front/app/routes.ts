import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('components/layout/anon-layout.tsx', [
    index('routes/home.tsx'),
    route('recover', 'routes/recover.tsx'),
  ]),
  layout('components/layout/auth-layout.tsx', [
    route('dashboard', 'routes/dashboard.tsx'),
    route('profiles', 'routes/profiles.tsx'),
  ]),
] satisfies RouteConfig;
