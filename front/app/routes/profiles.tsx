import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import AddProfileButton from '~/components/profiles/add-profile-button';
import { tableColumns } from '~/components/profiles/table-columns';
import { DataTable } from '~/components/table/data-table';
import useAuth from '~/contexts/auth/use-auth';
import { fetchProfiles } from '~/lib/profiles';
import { ListenerHandler } from '~/types/listener';
import type { Profile } from '~/types/profile';

export default function Profiles() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ user, t }), [user, t]);
  const listenerHandler = new ListenerHandler<Profile>();

  useEffect(() => {
    if (user) {
      listenerHandler.trigger(user.activeProfile);
    }
  }, [user]);

  return (
    <PageContent title={t('profiles.title')} subtitle={t('profiles.subtitle')}>
      <DataTable
        addElement={<AddProfileButton onAdded={(profile) => listenerHandler.trigger(profile)} />}
        columns={columns}
        dataFetcher={(pageFilters) => fetchProfiles(pageFilters)}
        onAddedListener={listenerHandler}
        textFilters={[{ title: t('profiles.name'), column: 'name' }]}
      />
    </PageContent>
  );
}
