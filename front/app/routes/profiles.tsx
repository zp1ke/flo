import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import AddProfileButton from '~/routes/profiles/add-profile-button';

export default function Profiles() {
  const { t } = useTranslation();

  return (
    <PageContent title={t('profiles.title')} subtitle={t('profiles.subtitle')}>
      <div className="flex items-center">
        <AddProfileButton />
      </div>
      <h1>TODO: profiles cards</h1>
    </PageContent>
  );
}
