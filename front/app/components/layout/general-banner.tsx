import { useTranslation } from 'react-i18next';
import useUserStore from '~/store/user-store';

export default function GeneralBanner() {
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();

  if (user && !user?.verified) {
    return (
      <div className="text-destructive text-sm font-medium">{t('verify.userNotVerified')}</div>
    );
  }

  return null;
}
