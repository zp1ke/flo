import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import PageContent from '~/components/layout/page-content';
import { DataTable } from '~/components/table/data-table';
import { tableColumns } from '~/routes/wallets/table-columns';
import useWalletStore from '~/store/wallet-store';
import { EditWalletForm } from './wallets/edit-wallet-form';

export default function Wallets() {
  const { t, i18n } = useTranslation();

  const columns = useMemo(
    () => tableColumns({ t, language: i18n.language }),
    [t, i18n],
  );

  const errorMessage = useWalletStore((state) => state.errorMessage);

  useEffect(() => {
    if (errorMessage) {
      toast.error(t('wallets.fetchError'), {
        description: t(errorMessage),
        closeButton: true,
      });
    }
  }, [errorMessage, t]);

  return (
    <PageContent title={t('wallets.title')} subtitle={t('wallets.subtitle')}>
      <DataTable
        columns={columns}
        dataStore={useWalletStore}
        textFilters={[{ title: t('wallets.name'), column: 'name' }]}
        addTitle={t('wallets.add')}
        addDescription={t('wallets.editDescription')}
        editForm={EditWalletForm}
        initialSorting={[{ id: 'id', desc: true }]}
      />
    </PageContent>
  );
}
