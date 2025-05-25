import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import { tableColumns } from '~/components/profiles/table-columns';
import { DataTable } from '~/components/table/data-table';
import { fetchProfiles } from '~/lib/profiles';

export default function Profiles() {
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ t }), [t]);

  return (
    <PageContent title={t('profiles.title')} subtitle={t('profiles.subtitle')}>
      <DataTable
        columns={columns}
        dataFetcher={(pageFilters) => fetchProfiles(pageFilters)}
        textFilters={[{ title: t('profiles.name'), column: 'name' }]}
      />
    </PageContent>
  );
}
