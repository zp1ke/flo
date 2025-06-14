import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import { tableColumns } from '~/routes/categories/table-columns';
import { DataTable } from '~/components/table/data-table';
import useAuth from '~/contexts/auth/use-auth';
import { fetchCategories } from '~/api/categories';
import AddCategoryButton from '~/routes/categories/add-category-button';
import type { Category } from '~/types/category';
import { ListenerManager } from '~/types/listener';

export default function Categories() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ t }), [t]);
  const listenerManager = useMemo(() => new ListenerManager<Category>(), []);

  return (
    <PageContent title={t('categories.title')} subtitle={t('categories.subtitle')}>
      <div className="flex items-center">
        <AddCategoryButton
          onAdded={(category) => listenerManager.notify({ type: 'added', data: category })}
        />
      </div>
      <DataTable
        columns={columns}
        dataFetcher={(pageFilters) => fetchCategories(user?.activeProfile.code ?? '-', pageFilters)}
        textFilters={[{ title: t('categories.name'), column: 'name' }]}
        listenerManager={listenerManager}
      />
    </PageContent>
  );
}
