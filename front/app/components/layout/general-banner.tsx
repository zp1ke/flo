import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import useUserStore from '~/store/user-store';
import { TypingText } from '../animate-ui/text/typing';

export default function GeneralBanner() {
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();

  const navigate = useNavigate();

  if (user && !user?.verified) {
    return (
      <TypingText
        className="cursor-pointer text-destructive text-sm font-medium"
        text={t('verify.userNotVerified')}
        loop={true}
        onClick={() => navigate('/settings')}
      />
    );
  }

  return null;
}
