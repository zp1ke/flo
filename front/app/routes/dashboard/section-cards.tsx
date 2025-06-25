import { DollarSignIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import { RollingText } from '~/components/animate-ui/text/rolling';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { cn, formatNumber, moneyClassName } from '~/lib/utils';
import type { TransactionsStats } from '~/types/transaction';

interface SectionCardProp {
  key: string;
  title: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  value: number;
  valueSuffix?: string;
  decimalPlaces?: number;
  description: string;
  trend?: 'up' | 'down';
  trendValue?: number;
  colorClass?: string;
}

interface SectionCardsProps {
  stats?: TransactionsStats;
}

export function SectionCards({ stats }: SectionCardsProps) {
  const { t } = useTranslation();

  const data = mapStatsToSectionCards(stats);

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      {data.map((item) => {
        let colorClass = item.colorClass;
        if (!colorClass) {
          colorClass = moneyClassName(item.value);
        }
        const formattedValue = formatNumber(
          item.value,
          item.decimalPlaces ?? 0,
        );

        return (
          <Card className="@container/card" key={item.key}>
            <CardHeader className="relative">
              <CardDescription>{t(item.title)}</CardDescription>
              <CardTitle
                className={cn(
                  '@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex justify-start items-center',
                  colorClass,
                )}
              >
                {item.icon && <item.icon className="mr-2 size-6" />}
                <RollingText text={formattedValue} />
                &nbsp;{item.valueSuffix}
              </CardTitle>
              {item.trendValue && (
                <div className="absolute right-4 top-0">
                  <Badge
                    variant="outline"
                    className="flex gap-1 rounded-lg text-xs"
                  >
                    {item.trend === 'up' && (
                      <TrendingUpIcon className="size-3" />
                    )}
                    {item.trend === 'down' && (
                      <TrendingDownIcon className="size-3" />
                    )}
                    {item.trend === 'up' ? '+' : '-'}
                    {item.trendValue.toFixed(1)}%
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {t(item.description)}
              </div>
              {/* <div className="text-muted-foreground">
                Visitors for the last 6 months
              </div> */}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

const mapStatsToSectionCards = (
  stats?: TransactionsStats,
): SectionCardProp[] => {
  if (!stats) {
    return [];
  }

  return [
    {
      key: 'income',
      title: 'dashboard.income',
      icon: DollarSignIcon,
      value: stats.income,
      decimalPlaces: 2,
      description: 'dashboard.incomeDescription',
    },
    {
      key: 'expenses',
      title: 'dashboard.expenses',
      icon: DollarSignIcon,
      value: stats.outcome,
      decimalPlaces: 2,
      description: 'dashboard.expensesDescription',
    },
    {
      key: 'balance',
      title: 'dashboard.balance',
      icon: DollarSignIcon,
      value: stats.balance,
      decimalPlaces: 2,
      description: 'dashboard.balanceDescription',
    },
    {
      key: 'transactions',
      title: 'dashboard.transactions',
      value: stats.transactions.length,
      description: 'dashboard.transactionsDescription',
      colorClass: 'text-foreground',
    },
  ] satisfies SectionCardProp[];
};
