import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import { tableColumns } from '~/routes/wallets/table-columns';
import { DataTable } from '~/components/ui/table/data-table';
import useAuth from '~/contexts/auth/use-auth';
import { fetchWallets } from '~/api/wallets';
import AddWalletButton from '~/routes/wallets/add-wallet-button';
import type { Wallet } from '~/types/wallet';

export default function Wallets() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns({ t }), [t]);
  const listenerManager = useMemo(() => new ListenerManager<Wallet>(), []);

  return (
    <PageContent title={t('wallets.title')} subtitle={t('wallets.subtitle')}>
      <div className="flex items-center">
        <AddWalletButton
          onAdded={(wallet) => listenerManager.notify({ type: 'added', data: wallet })}
        />
      </div>
      <DataTable
        columns={columns}
        dataFetcher={(pageFilters) => fetchWallets(user?.activeProfile.code ?? '-', pageFilters)}
        textFilters={[{ title: t('wallets.name'), column: 'name' }]}
        listenerManager={listenerManager}
      />
    </PageContent>
  );
}
