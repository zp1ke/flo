interface DataTableFilter {
  title: string;
  column: string;
}

interface DataTableSelectFilter extends DataTableFilter {
  options: { label: string; value: string }[];
}
