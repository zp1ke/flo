import { useTranslation } from 'react-i18next';
import useUserStore from '~/store/user-store';
import { TypingText } from '../animate-ui/text/typing';

export default function GeneralBanner() {
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();

  if (user && !user?.verified) {
    return (
      <TypingText
        className="text-destructive text-sm font-medium"
        text={t('verify.userNotVerified')}
        loop={true}
      />
    );
  }

  return null;
}
