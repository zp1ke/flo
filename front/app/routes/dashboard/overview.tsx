import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { formatMoney, moneyClassName } from '~/lib/utils';
import type { TransactionsStats } from '~/types/transaction';

interface OverviewProps {
  stats?: TransactionsStats;
}

enum ChartType {
  categories = 'categories',
  wallets = 'wallets',
}

export function Overview({ stats }: OverviewProps) {
  const { t, i18n } = useTranslation();

  const [chartType, setChartType] = useState<ChartType>(ChartType.categories);

  const chartConfig = useMemo<ChartConfig>(() => {
    return {
      income: {
        label: t('dashboard.income'),
        color: `var(--${moneyClassName(1)})`,
      },
      outcome: {
        label: t('dashboard.expenses'),
        color: `var(--${moneyClassName(-1)})`,
      },
    } satisfies ChartConfig;
  }, [t]);

  const data = useMemo(() => {
    if (chartType === ChartType.categories) {
      return stats?.categories;
    }
    if (chartType === ChartType.wallets) {
      return stats?.wallets;
    }
    return [];
  }, [chartType, stats]);

  if (!stats?.transactions?.length) {
    return (
      <div className="text-center text-lg text-muted-foreground h-full flex items-center justify-center">
        {i18n.t('dashboard.noData')}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-end">
        <Select
          value={chartType}
          onValueChange={(value: string) => {
            setChartType(value as ChartType);
          }}
        >
          <SelectTrigger className="h-8 w-36">
            <SelectValue placeholder={'select todo chart type'} />
          </SelectTrigger>
          <SelectContent side="top">
            {Object.keys(ChartType).map((cType) => (
              <SelectItem key={cType} value={cType}>
                {t(`dashboard.${cType}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={chartConfig}>
        <BarChart data={data ?? []}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatMoney(value, i18n.language)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="outcome" fill="var(--color-outcome)" radius={4} />
        </BarChart>
      </ChartContainer>
      <ChartLegend content={<ChartLegendContent />} />
    </div>
  );
}
