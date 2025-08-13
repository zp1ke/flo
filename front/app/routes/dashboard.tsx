import { Loader2, RefreshCwIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { ApiError } from '~/api/client';
import { fetchStats } from '~/api/transactions';
import PageContent from '~/components/layout/page-content';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { DatePicker } from '~/components/ui/date-picker';
import Loading from '~/components/ui/loading';
import { firstDateOfMonth } from '~/lib/utils';
import { Overview } from '~/routes/dashboard/overview';
import { SectionCards } from '~/routes/dashboard/section-cards';
import { TransactionsList } from '~/routes/dashboard/transactions-list';
import useUserStore from '~/store/user-store';
import type { TransactionsStats } from '~/types/transaction';

export default function Dashboard() {
  const { t } = useTranslation();

  const profile = useUserStore((state) => state.profile);

  const [fromDate, setFromDate] = useState<Date | undefined>(firstDateOfMonth());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<TransactionsStats | undefined>(undefined);

  const loadData = useCallback(async () => {
    if (fromDate && profile?.code) {
      setLoading(true);
      fetchStats(profile.code, fromDate, toDate)
        .then(setStats)
        .catch((e) => {
          toast.error(t('transactions.fetchError'), {
            description: t((e as ApiError).message),
            closeButton: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [t, profile, fromDate, toDate]);

  useEffect(() => {
    loadData().then(() => { });
  }, [loadData]);

  return (
    <PageContent
      title={t('dashboard.title')}
      subtitle={t('dashboard.subtitle')}
      headerEnd={
        <div className="flex items-end gap-1">
          <DatePicker
            title={t('dashboard.date')}
            placeholder={t('dashboard.pickDate')}
            value={fromDate}
            minDate={
              profile?.createdAt
                ? new Date(profile.createdAt)
                : new Date('2025-06-01')
            }
            maxDate={new Date()}
            onChange={setFromDate}
          />
          <DatePicker
            title={t('dashboard.date')}
            placeholder={t('dashboard.pickDate')}
            value={toDate}
            minDate={toDate}
            maxDate={new Date()}
            onChange={setToDate}
          />
          <Button
            variant="outline"
            size="icon"
            disabled={loading}
            onClick={loadData}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {!loading && <RefreshCwIcon />}
          </Button>
        </div>
      }
    >
      {loading && <Loading />}
      {loading || (
        <>
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards stats={stats} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 gap-0">
              <CardHeader>
                <CardTitle>{t('dashboard.overview')}</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview stats={stats} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{t('dashboard.lastTransactions')}</CardTitle>
                <CardDescription>
                  {t('dashboard.lastTransactionsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <TransactionsList data={stats?.transactions ?? []} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </PageContent>
  );
}
