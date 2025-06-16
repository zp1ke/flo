import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchWallets } from '~/api/wallets';
import PageContent from '~/components/layout/page-content';
import { DataTable } from '~/components/table/data-table';
import { tableColumns } from '~/routes/wallets/table-columns';
import useUserStore from '~/store/user-store';
import { ListenerManager } from '~/types/listener';
import type { Wallet } from '~/types/wallet';
import { EditWalletForm } from './wallets/edit-wallet-form';

export default function Wallets() {
  const profile = useUserStore((state) => state.profile);

  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ t }), [t]);
  const listenerManager = useMemo(() => new ListenerManager<Wallet>(), []);

  return (
    <PageContent title={t('wallets.title')} subtitle={t('wallets.subtitle')}>
      <DataTable
        columns={columns}
        dataFetcher={(pageFilters) => fetchWallets(profile?.code ?? '', pageFilters)}
        textFilters={[{ title: t('wallets.name'), column: 'name' }]}
        listenerManager={listenerManager}
        fetchErrorMessage={t('wallets.fetchError')}
        addTitle={t('wallets.add')}
        addDescription={t('wallets.editDescription')}
        editForm={EditWalletForm}
      />
    </PageContent>
  );
}
