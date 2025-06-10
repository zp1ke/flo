import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import { tableColumns } from '~/components/categories/table-columns';
import { DataTable } from '~/components/ui/table/data-table';
import useAuth from '~/contexts/auth/use-auth';
import { fetchCategories } from '~/api/categories';
import AddCategoryButton from '~/components/categories/add-category-button';

export default function Categories() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ t }), [t]);

  return (
    <PageContent title={t('categories.title')} subtitle={t('categories.subtitle')}>
      <div className="flex items-center">
        <AddCategoryButton />
      </div>
      <DataTable
        columns={columns}
        dataFetcher={(pageFilters) => fetchCategories(user?.activeProfile.code ?? '-', pageFilters)}
        textFilters={[{ title: t('categories.name'), column: 'name' }]}
      />
    </PageContent>
  );
}
