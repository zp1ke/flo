import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import AddProfileButton from '~/routes/profiles/add-profile-button';
import { tableColumns } from '~/routes/profiles/table-columns';
import { DataTable } from '~/components/table/data-table';
import useAuth from '~/contexts/auth/use-auth';
import { fetchProfiles } from '~/api/profiles';

export default function Profiles() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ user, t }), [user, t]);

  return (
    <PageContent title={t('profiles.title')} subtitle={t('profiles.subtitle')}>
      <div className="flex items-center">
        <AddProfileButton />
      </div>
      <DataTable
        columns={columns}
        dataFetcher={(pageFilters) => fetchProfiles(pageFilters)}
        textFilters={[{ title: t('profiles.name'), column: 'name' }]}
      />
    </PageContent>
  );
}
