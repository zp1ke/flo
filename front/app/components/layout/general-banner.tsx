import { useTranslation } from 'react-i18next';
import useAuth from '~/contexts/auth/use-auth';

export default function GeneralBanner() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user?.verified) {
    return (
      <div className="text-destructive text-sm font-medium">{t('verify.userNotVerified')}</div>
    );
  }

  return null;
}
