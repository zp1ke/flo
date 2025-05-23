import PageContent from '~/components/layout/page-content';
import { columns } from '~/components/profiles/table-columns';
import { type DataPage, DataTable } from '~/components/table/data-table';
import { type Profile } from '~/types/profile';

export default function Profiles() {
  return (
    <PageContent title="PROFILES TODO" subtitle="Here's a list of your profiles!">
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
            }, 10000);
          });
        }}
        textFilters={[{ title: 'Name', column: 'name' }]}
      />
    </PageContent>
  );
}
