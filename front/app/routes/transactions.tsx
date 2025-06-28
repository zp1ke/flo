import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { toApiDate } from '~/api/client';
import PageContent from '~/components/layout/page-content';
import type { DataTableCustomFilter } from '~/components/table/data-filter';
import { DataTable } from '~/components/table/data-table';
import { DatePicker } from '~/components/ui/date-picker';
import { tableColumns } from '~/routes/transactions/table-columns';
import useTransactionStore from '~/store/transaction-store';
import useUserStore from '~/store/user-store';
import { EditTransactionForm } from './transactions/edit-transaction-form';

export default function Transactions() {
  const { t, i18n } = useTranslation();

  const profile = useUserStore((state) => state.profile);

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

  const fromDateFilter: DataTableCustomFilter = useMemo(
    () => ({
      column: 'from',
      render: ({ onChange, value, disabled }) => (
        <DatePicker
          key="from-date-filter"
          placeholder={t('transactions.fromDate')}
          value={value ? new Date(value) : undefined}
          minDate={
            profile?.createdAt
              ? new Date(profile.createdAt)
              : new Date('2025-06-01')
          }
          maxDate={new Date()}
          onChange={(date) => {
            const dateStr = toApiDate(date);
            if (dateStr) {
              onChange(dateStr);
            }
          }}
          disabled={disabled}
        />
      ),
    }),
    [t, profile],
  );

  const toDateFilter: DataTableCustomFilter = useMemo(
    () => ({
      column: 'to',
      render: ({ onChange, value, disabled }) => (
        <DatePicker
          key="to-date-filter"
          placeholder={t('transactions.toDate')}
          value={value ? new Date(value) : undefined}
          minDate={
            profile?.createdAt
              ? new Date(profile.createdAt)
              : new Date('2025-06-01')
          }
          maxDate={new Date()}
          onChange={(date) => {
            const dateStr = toApiDate(date);
            if (dateStr) {
              onChange(dateStr);
            }
          }}
          disabled={disabled}
        />
      ),
    }),
    [t, profile],
  );

  return (
    <PageContent
      title={t('transactions.title')}
      subtitle={t('transactions.subtitle')}
    >
      <DataTable
        columns={columns}
        dataStore={useTransactionStore}
        customFilters={[fromDateFilter, toDateFilter]}
        addTitle={t('transactions.add')}
        addDescription={t('transactions.editDescription')}
        editForm={EditTransactionForm}
        initialSorting={[
          { id: 'datetime', desc: true },
          { id: 'id', desc: true },
        ]}
      />
    </PageContent>
  );
}
