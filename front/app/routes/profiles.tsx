import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import { tableColumns } from '~/components/profiles/table-columns';
import { type DataPage, DataTable } from '~/components/table/data-table';
import { type Profile } from '~/types/profile';

export default function Profiles() {
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ t }), [t]);

  return (
    <PageContent title={t('profiles.title')} subtitle={t('profiles.subtitle')}>
      <DataTable
        columns={columns}
        dataFetcher={async (pagination): Promise<DataPage<Profile>> => {
          return new Promise((resolve) => {
            setTimeout(() => {
              const data = Array.from({ length: pagination.pageSize }, (_, index) => {
                const profileIndex = pagination.pageIndex * pagination.pageSize + index + 1;
                return {
                  code: `profile-${profileIndex}`,
                  name: `Profile ${profileIndex}`,
                } satisfies Profile;
              });
              resolve({
                data,
                total: 100,
              });
            }, 1000);
          });
        }}
        textFilters={[{ title: t('profiles.name'), column: 'name' }]}
      />
    </PageContent>
  );
}
