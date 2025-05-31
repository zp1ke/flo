import { GalleryVerticalEnd } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, redirect } from 'react-router';
import { LanguageSelector } from '~/components/layout/language-selector';
import { ThemeModeSelector } from '~/components/layout/theme-mode-selector';
import { fetchUser } from '~/lib/auth';
import type { HorizontalPosition } from '~/types/position';

export async function clientLoader() {
  const user = await fetchUser(false);
  if (user) {
    return redirect('/dashboard');
  }
}

export type AnonContextType = {
  setPlaceholderPosition: (position: HorizontalPosition) => void;
};

export default function AnonLayout() {
  const { t } = useTranslation();

  const [placeholderPosition, setPlaceholderPosition] = useState<HorizontalPosition>('left');

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {placeholderPosition !== 'right' && (
        <div className="relative hidden bg-muted lg:block transition ease-in delay-100 duration-100">
          <img
            src="/placeholder.svg"
            alt={t('app.title')}
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      )}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link to="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              {t('app.name')}
            </Link>
          </div>
          <div className="flex items-center gap-2 px-4">
            <LanguageSelector />
            <ThemeModeSelector />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet context={{ setPlaceholderPosition }} />
          </div>
        </div>
      </div>
      {placeholderPosition === 'right' && (
        <div className="relative hidden bg-muted lg:block transition ease-in delay-100 duration-100">
          <img
            src="/placeholder.svg"
            alt={t('app.title')}
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      )}
    </div>
  );
}
