import { useTranslation } from 'react-i18next';
import { useTheme } from '~/contexts/theme-provider';
import { cn } from '~/lib/utils';

interface AppLogoProps {
  className?: string;
}

const AppLogo = ({ className }: AppLogoProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <>
      {theme === 'light' && (
        <img
          src="/images/apple-touch-icon-light.png"
          alt={t('app.name')}
          className={cn('object-cover', className)}
        />
      )}
      {theme === 'dark' && (
        <img
          src="/images/apple-touch-icon-dark.png"
          alt={t('app.name')}
          className={cn('object-cover', className)}
        />
      )}
      {theme === 'system' && (
        <picture className={cn('object-cover', className)}>
          <source
            srcSet="/images/apple-touch-icon-dark.png"
            media="(prefers-color-scheme: dark)"
          />
          <source
            srcSet="/images/apple-touch-icon-light.png"
            media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
          />
          <img src="/images/apple-touch-icon-light.png" alt={t('app.name')} />
        </picture>
      )}
    </>
  );
};

export default AppLogo;
