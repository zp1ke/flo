import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

interface DataTablePaginationProps<TData> {
  disabled?: boolean;
  pageSizes: number[];
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  disabled,
  pageSizes,
  table,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {t('table.ofSelected', {
          count: table.getFilteredRowModel().rows.length,
          selected: table.getFilteredSelectedRowModel().rows.length,
        })}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t('table.rowsPerPage')}</p>
          <Select
            disabled={disabled}
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}>
            <SelectTrigger className="h-8 w-[70px]" disabled={disabled}>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} disabled={disabled}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t('table.pageOf', {
            page: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={disabled || !table.getCanPreviousPage()}>
            <span className="sr-only">{t('table.goToFirstPage')}</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={disabled || !table.getCanPreviousPage()}>
            <span className="sr-only">{t('table.goToPreviousPage')}</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={disabled || !table.getCanNextPage()}>
            <span className="sr-only">{t('table.goToNextPage')}</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={disabled || !table.getCanNextPage()}>
            <span className="sr-only">{t('table.goToLastPage')}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
