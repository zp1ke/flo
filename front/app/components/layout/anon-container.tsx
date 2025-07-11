import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { LanguageSelector } from '~/components/layout/language-selector';
import { ThemeModeSelector } from '~/components/layout/theme-mode-selector';
import type { HorizontalPosition } from '~/types/position';
import AppLogo from '../app-logo';

export default function AnonContainer({
  placeholderPosition,
  children,
}: {
  placeholderPosition?: HorizontalPosition;
  children: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {placeholderPosition === 'left' && (
        <div className="relative hidden bg-muted lg:block transition ease-in delay-100 duration-100">
          <img
            src="/images/placeholder.svg"
            alt={t('app.title')}
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      )}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link to="/" className="flex items-center gap-2 font-medium">
              <AppLogo className="size-4" />
              {t('app.name')}
            </Link>
          </div>
          <div className="flex items-center gap-2 px-4">
            <LanguageSelector />
            <ThemeModeSelector />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      {placeholderPosition === 'right' && (
        <div className="relative hidden bg-muted lg:block transition ease-in delay-100 duration-100">
          <img
            src="/images/placeholder.svg"
            alt={t('app.title')}
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      )}
    </div>
  );
}
