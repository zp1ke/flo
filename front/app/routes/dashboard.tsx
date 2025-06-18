import PageContent from '~/components/layout/page-content';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Overview } from '~/routes/dashboard/overview';
import { RecentSales } from '~/routes/dashboard/recent-sales';
import { SectionCards } from '~/routes/dashboard/section-cards';

export default function Dashboard() {
  return (
    <PageContent
      title="DASHBOARD TODO"
      headerEnd={
        <div className="flex items-center">
          <span>DAY PICKER</span>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
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
