import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import { tableColumns } from '~/routes/transactions/table-columns';
import { DataTable } from '~/components/table/data-table';
import { fetchTransactions } from '~/api/transactions';
import AddTransactionButton from '~/routes/transactions/add-transaction-button';
import type { Transaction } from '~/types/transaction';
import { ListenerManager } from '~/types/listener';
import useUserStore from '~/store/user-store';

export default function Transactions() {
  const profile = useUserStore((state) => state.profile);

  const { t, i18n } = useTranslation();

  const columns = useMemo(() => tableColumns({ t, language: i18n.language }), [t, i18n]);
  const listenerManager = useMemo(() => new ListenerManager<Transaction>(), []);

  return (
    <PageContent title={t('transactions.title')} subtitle={t('transactions.subtitle')}>
      <div className="flex items-center">
        <AddTransactionButton
          onAdded={(transaction) => listenerManager.notify({ type: 'added', data: transaction })}
        />
      </div>
      <DataTable
        columns={columns}
        dataFetcher={(pageFilters) => fetchTransactions(profile?.code ?? '', pageFilters)}
        textFilters={[]}
        listenerManager={listenerManager}
        fetchErrorMessage={t('transactions.fetchError')}
      />
    </PageContent>
  );
}
