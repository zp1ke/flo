import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTransactions } from '~/api/transactions';
import PageContent from '~/components/layout/page-content';
import { DataTable } from '~/components/table/data-table';
import { tableColumns } from '~/routes/transactions/table-columns';
import useUserStore from '~/store/user-store';
import { ListenerManager } from '~/types/listener';
import type { Transaction } from '~/types/transaction';
import { EditTransactionForm } from './transactions/edit-transaction-form';

export default function Transactions() {
  const profile = useUserStore((state) => state.profile);

  const { t, i18n } = useTranslation();

  const columns = useMemo(() => tableColumns({ t, language: i18n.language }), [t, i18n]);
  const listenerManager = useMemo(() => new ListenerManager<Transaction>(), []);

  return (
    <PageContent title={t('transactions.title')} subtitle={t('transactions.subtitle')}>
      <DataTable
        columns={columns}
        dataFetcher={(pageFilters) => fetchTransactions(profile?.code ?? '', pageFilters)}
        textFilters={[]}
        listenerManager={listenerManager}
        fetchErrorMessage={t('transactions.fetchError')}
        addTitle={t('transactions.add')}
        addDescription={t('transactions.editDescription')}
        editForm={EditTransactionForm}
      />
    </PageContent>
  );
}
