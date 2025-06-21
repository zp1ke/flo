export interface DataTableFilter {
  title: string;
  column: string;
}

export interface DataTableSelectFilter extends DataTableFilter {
  options: { label: string; value: string }[];
}

export interface DataTableCustomFilterRenderProps {
  onChange: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

export interface DataTableCustomFilter {
  column: string;
  render: (props: DataTableCustomFilterRenderProps) => React.ReactNode;
}
