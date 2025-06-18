import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import PageContent from '~/components/layout/page-content';
import { DataTable } from '~/components/table/data-table';
import { tableColumns } from '~/routes/transactions/table-columns';
import useTransactionStore from '~/store/transaction-store';
import { EditTransactionForm } from './transactions/edit-transaction-form';

export default function Transactions() {
  const { t, i18n } = useTranslation();

  const columns = useMemo(
    () => tableColumns({ t, language: i18n.language }),
    [t, i18n],
  );

  const errorMessage = useTransactionStore((state) => state.errorMessage);

  useEffect(() => {
    if (errorMessage) {
      toast.error(t('transactions.fetchError'), {
        description: t(errorMessage),
        closeButton: true,
      });
    }
  }, [errorMessage, t]);

  return (
    <PageContent
      title={t('transactions.title')}
      subtitle={t('transactions.subtitle')}
    >
      <DataTable
        columns={columns}
        dataStore={useTransactionStore}
        textFilters={[]}
        addTitle={t('transactions.add')}
        addDescription={t('transactions.editDescription')}
        editForm={EditTransactionForm}
      />
    </PageContent>
  );
}
