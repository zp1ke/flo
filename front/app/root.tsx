import React, { Suspense } from 'react';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import Loading from './components/ui/loading';
import './app.css';
import './lib/i18n';
import { ThemeProvider } from '~/contexts/theme-provider';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  const { t } = useTranslation();

  return [{ title: t('app.title') }, { name: 'description', content: t('app.welcome') }];
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  return (
    <html lang={i18n.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Suspense fallback="...">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>
    </Suspense>
  );
}

export function HydrateFallback() {
  return <Loading wrapperClassName="min-h-screen" />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();

  let message = t('error.message');
  let details = t('error.details');
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : t('error.title');
    details = error.status === 404 ? t('error.notFound') : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Suspense fallback="...">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <main className="pt-16 p-4 container mx-auto h-screen">
          <h1 className="text-3xl font-bold mb-4">{message}</h1>
          <p>{details}</p>
          {stack && (
            <pre className="w-full p-4 overflow-x-auto">
              <code>{stack}</code>
            </pre>
          )}
        </main>
      </ThemeProvider>
    </Suspense>
  );
}
