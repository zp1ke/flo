import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import PageContent from '~/components/layout/page-content';
import type { DataTableCustomFilter } from '~/components/table/data-filter';
import { DataTable } from '~/components/table/data-table';
import { DatePicker } from '~/components/ui/date-picker';
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

  const fromDateFilter: DataTableCustomFilter = useMemo(
    () => ({
      column: 'fromDate',
      render: ({ onChange, value, disabled }) => (
        <DatePicker
          placeholder={t('transactions.fromDate')}
          value={value ? new Date(value) : undefined}
          minDate={new Date('2025-06-01')} // TODO: Replace with profile creation date
          maxDate={new Date()}
          onChange={(date) => {
            if (date) {
              onChange(date.toISOString());
            }
          }}
          disabled={disabled}
        />
      ),
    }),
    [t],
  );

  const toDateFilter: DataTableCustomFilter = useMemo(
    () => ({
      column: 'toDate',
      render: ({ onChange, value, disabled }) => (
        <DatePicker
          placeholder={t('transactions.toDate')}
          value={value ? new Date(value) : undefined}
          minDate={new Date('2025-06-01')} // TODO: Replace with profile creation date
          maxDate={new Date()}
          onChange={(date) => {
            if (date) {
              onChange(date.toISOString());
            }
          }}
          disabled={disabled}
        />
      ),
    }),
    [t],
  );

  return (
    <PageContent
      title={t('transactions.title')}
      subtitle={t('transactions.subtitle')}
    >
      <DataTable
        columns={columns}
        dataStore={useTransactionStore}
        textFilters={[
          { title: t('transactions.description'), column: 'description' },
        ]}
        customFilters={[fromDateFilter, toDateFilter]}
        addTitle={t('transactions.add')}
        addDescription={t('transactions.editDescription')}
        editForm={EditTransactionForm}
      />
    </PageContent>
  );
}
