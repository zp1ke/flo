import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('components/layout/anon-layout.tsx', [
    index('routes/home.tsx'),
    route('sign-in', 'routes/sign-in.tsx'),
    route('sign-up', 'routes/sign-up.tsx'),
    route('recover', 'routes/recover.tsx'),
    route('recovery/:code', 'routes/recovery.tsx'),
  ]),
  route('verify/:code', 'routes/verify.tsx'),
  layout('components/layout/auth-layout.tsx', [
    route('dashboard', 'routes/dashboard.tsx'),
    route('profiles', 'routes/profiles.tsx'),
    route('categories', 'routes/categories.tsx'),
    route('wallets', 'routes/wallets.tsx'),
  ]),
] satisfies RouteConfig;
