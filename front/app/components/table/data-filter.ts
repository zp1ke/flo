export interface DataTableFilter {
  title: string;
  column: string;
}

export interface DataTableSelectFilter extends DataTableFilter {
  options: { label: string; value: string }[];
}
