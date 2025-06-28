import type { Table } from '@tanstack/react-table';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import type { DataItem } from '~/store/data-table-store';
import type { Category } from '~/types/category';
import { DataTableRowActions } from './table-row-actions';

export const mapCategories = (categories: Category[]): DataItem<Category>[] => {
  return categories.map((category) => ({
    // biome-ignore lint/style/noNonNullAssertion: category code is guaranteed to exist from API
    id: category.code!,
    item: category,
    render: (table: Table<Category>) => (
      <Card className="@container/card" key={category.code}>
        <CardHeader className="relative">
          <CardDescription>{category.code}</CardDescription>
          <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold tabular-nums flex justify-start items-center">
            {category.name}
          </CardTitle>
        </CardHeader>
        <CardFooter className="gap-2 flex justify-end items-center">
          <DataTableRowActions data={category} table={table} />
        </CardFooter>
      </Card>
    ),
  }));
};
