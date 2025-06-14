import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import { tableColumns } from '~/routes/transactions/table-columns';
import { DataTable } from '~/components/table/data-table';
import useAuth from '~/contexts/auth/use-auth';
import { fetchTransactions } from '~/api/transactions';
import AddTransactionButton from '~/routes/transactions/add-transaction-button';
import type { Transaction } from '~/types/transaction';
import { ListenerManager } from '~/types/listener';

export default function Transactions() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ t }), [t]);
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
        dataFetcher={(pageFilters) =>
          fetchTransactions(user?.activeProfile.code ?? '-', pageFilters)
        }
        textFilters={[]}
        listenerManager={listenerManager}
      />
    </PageContent>
  );
}
