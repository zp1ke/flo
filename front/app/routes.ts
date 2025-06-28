import {
  index,
  layout,
  type RouteConfig,
  route,
} from '@react-router/dev/routes';

export default [
  layout('components/layout/anon-layout.tsx', [
    index('routes/home.tsx'),
    route('recover', 'routes/recover.tsx'),
    route('recovery/:code', 'routes/recovery.tsx'),
    route('sign-in', 'routes/sign-in.tsx'),
    route('sign-up', 'routes/sign-up.tsx'),
  ]),
  route('verify/:code', 'routes/verify.tsx'),
  layout('components/layout/auth-layout.tsx', [
    route('about', 'routes/about.tsx'),
    route('categories', 'routes/categories.tsx'),
    route('dashboard', 'routes/dashboard.tsx'),
    route('profiles', 'routes/profiles.tsx'),
    route('settings', 'routes/settings.tsx'),
    route('transactions', 'routes/transactions.tsx'),
    route('wallets', 'routes/wallets.tsx'),
  ]),
] satisfies RouteConfig;
