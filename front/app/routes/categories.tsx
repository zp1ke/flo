import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import PageContent from '~/components/layout/page-content';
import { DataTable } from '~/components/table/data-table';
import { tableColumns } from '~/routes/categories/table-columns';
import useCategoryStore from '~/store/category-store';
import { EditCategoryForm } from './categories/edit-category-form';

export default function Categories() {
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ t }), [t]);

  const errorMessage = useCategoryStore((state) => state.errorMessage);

  useEffect(() => {
    if (errorMessage) {
      toast.error(t('categories.fetchError'), {
        description: t(errorMessage),
        closeButton: true,
      });
    }
  }, [errorMessage, t]);

  return (
    <PageContent title={t('categories.title')} subtitle={t('categories.subtitle')}>
      <DataTable
        columns={columns}
        dataStore={useCategoryStore}
        textFilters={[{ title: t('categories.name'), column: 'name' }]}
        addTitle={t('categories.add')}
        addDescription={t('categories.editDescription')}
        editForm={EditCategoryForm}
      />
    </PageContent>
  );
}
