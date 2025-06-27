import type { DataItem } from '~/store/data-table-store';
import type { Category } from '~/types/category';

export const mapCategories = (categories: Category[]): DataItem<Category>[] => {
  return categories.map((category) => ({
    // biome-ignore lint/style/noNonNullAssertion: category code is guaranteed to exist from API
    id: category.code!,
    item: category,
    render: () => <span>{category.name}</span>,
  }));
};
