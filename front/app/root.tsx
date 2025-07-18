import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { ThemeProvider } from '~/contexts/theme-provider';

import type { Route } from './+types/root';
import './app.css';
import Loading from './components/ui/loading';
import { Toaster } from './components/ui/sonner';
import './lib/i18n';
import type { ApiError } from './api/client';

// biome-ignore lint/correctness/noEmptyPattern: meta function doesn't use destructured parameters
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Flo APP' },
    { name: 'description', content: 'Welcome to Flo APP' },
  ];
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
  {
    rel: 'manifest',
    href: '/site.webmanifest',
  },
  {
    rel: 'icon',
    href: '/images/favicon-light.ico',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    href: '/images/favicon-light-16.png',
    media: '(prefers-color-scheme: light)',
    type: 'image/png',
    sizes: '16x16',
  },
  {
    rel: 'icon',
    href: '/images/favicon-light-32.png',
    media: '(prefers-color-scheme: light)',
    type: 'image/png',
    sizes: '32x32',
  },
  {
    rel: 'apple-touch-icon',
    href: '/images/apple-touch-icon-light.png',
    media: '(prefers-color-scheme: light)',
    type: 'image/png',
    sizes: '180x180',
  },
  {
    rel: 'icon',
    href: '/images/favicon-dark.ico',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'icon',
    href: '/images/favicon-dark-16.png',
    media: '(prefers-color-scheme: dark)',
    type: 'image/png',
    sizes: '16x16',
  },
  {
    rel: 'icon',
    href: '/images/favicon-dark-32.png',
    media: '(prefers-color-scheme: dark)',
    type: 'image/png',
    sizes: '32x32',
  },
  {
    rel: 'apple-touch-icon',
    href: '/images/apple-touch-icon-dark.png',
    media: '(prefers-color-scheme: dark)',
    type: 'image/png',
    sizes: '180x180',
  },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
}

export function HydrateFallback() {
  return (
    <>
      <ThemeProvider>
        <Loading wrapperClassName="min-h-screen" />
      </ThemeProvider>
      <Scripts />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  console.error('ErrorBoundary caught an error:', error);

  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'Page not found.' : error.statusText || details;
  } else if (error as ApiError) {
    const ApiError = error as ApiError;
    details += ` ${ApiError.message}`;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <ThemeProvider>
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
  );
}
