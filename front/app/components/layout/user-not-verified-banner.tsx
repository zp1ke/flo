import { useTranslation } from 'react-i18next';
import useAuth from '~/contexts/auth/use-auth';

export default function UserNotVerifiedBanner() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user?.verified) return null;

  return (
    <div className="text-destructive text-sm font-medium">{t('verify.user_not_verified')}</div>
  );
}
