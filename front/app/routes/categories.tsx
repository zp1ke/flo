import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCategories } from '~/api/categories';
import PageContent from '~/components/layout/page-content';
import { DataTable } from '~/components/table/data-table';
import { tableColumns } from '~/routes/categories/table-columns';
import useUserStore from '~/store/user-store';
import type { Category } from '~/types/category';
import { ListenerManager } from '~/types/listener';
import { EditCategoryForm } from './categories/edit-category-form';

export default function Categories() {
  const profile = useUserStore((state) => state.profile);

  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ t }), [t]);
  const listenerManager = useMemo(() => new ListenerManager<Category>(), []);

  return (
    <PageContent title={t('categories.title')} subtitle={t('categories.subtitle')}>
      <DataTable
        columns={columns}
        dataFetcher={(pageFilters) => fetchCategories(profile?.code ?? '', pageFilters)}
        textFilters={[{ title: t('categories.name'), column: 'name' }]}
        listenerManager={listenerManager}
        fetchErrorMessage={t('categories.fetchError')}
        addTitle={t('categories.add')}
        addDescription={t('categories.editDescription')}
        editForm={EditCategoryForm}
      />
    </PageContent>
  );
}
