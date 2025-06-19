import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/layout/page-content';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { DatePicker } from '~/components/ui/date-picker';
import { Overview } from '~/routes/dashboard/overview';
import { RecentSales } from '~/routes/dashboard/recent-sales';
import {
  type SectionCardProp,
  SectionCards,
} from '~/routes/dashboard/section-cards';

const data = [
  {
    key: 'income',
    title: 'Income',
    valuePrefix: '$',
    value: 123456.78,
    valueSuffix: '',
    decimalPlaces: 2,
    description: 'Total income',
    trend: 'up',
    trendValue: 5.2,
  },
  {
    key: 'expenses',
    title: 'Expenses',
    valuePrefix: '$',
    value: 98765.43,
    valueSuffix: '',
    decimalPlaces: 2,
    description: 'Total expenses',
    trend: 'down',
    trendValue: 3.1,
  },
  {
    key: 'profit',
    title: 'Profit',
    valuePrefix: '$',
    value: 24691.35,
    valueSuffix: '',
    decimalPlaces: 2,
    description: 'Total profit',
    trend: 'up',
    trendValue: 5.2,
  },
  {
    key: 'transactions',
    title: 'Transactions',
    valuePrefix: '',
    value: 1500,
    valueSuffix: '',
    decimalPlaces: 0,
    description: 'Total transactions',
    trend: 'down',
    trendValue: 2.5,
  },
] satisfies SectionCardProp[];

export default function Dashboard() {
  const { t } = useTranslation();

  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <PageContent
      title={t('dashboard.title')}
      subtitle={t('dashboard.subtitle')}
      headerEnd={
        <div className="flex items-center">
          <DatePicker
            title={t('dashboard.date')}
            placeholder={t('dashboard.pickDate')}
            value={date}
            onChange={setDate}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards data={data} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </PageContent>
  );
}
