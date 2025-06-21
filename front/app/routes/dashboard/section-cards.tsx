import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SlidingNumber } from '~/components/animate-ui/text/sliding-number';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export interface SectionCardProp {
  key: string;
  title: string;
  valuePrefix?: string;
  value: number;
  valueSuffix?: string;
  decimalPlaces?: number;
  description: string;
  trend?: 'up' | 'down';
  trendValue?: number;
}

interface SectionCardsProps {
  data: SectionCardProp[];
}

export function SectionCards({ data }: SectionCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      {data.map((item) => (
        <Card className="@container/card" key={item.key}>
          <CardHeader className="relative">
            <CardDescription>{t(item.title)}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex justify-start items-center">
              {item.valuePrefix}&nbsp;
              <SlidingNumber
                number={item.value}
                decimalPlaces={item.decimalPlaces}
              />
              &nbsp;{item.valueSuffix}
            </CardTitle>
            {item.trendValue && (
              <div className="absolute right-4 top-0">
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs"
                >
                  {item.trend === 'up' && <TrendingUpIcon className="size-3" />}
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
      ))}
    </div>
  );
}
