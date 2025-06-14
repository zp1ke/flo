import { Check, ChevronsUpDown, RefreshCwIcon } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { FormControl } from '~/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

export interface ValueManager<T> {
  value: T;
  key: () => string;
  label: () => string;
}

interface SearchableSelectProps<T> {
  disabled?: boolean;
  value?: T;
  options: T[];
  placeholder: string;
  searchTitle: string;
  searchNotMatchMessage: string;
  converter: (value: T) => ValueManager<T>;
  onValueChange: (value: T) => void;
  onRefresh?: () => void;
}

export function SearchableSelect<T>({
  disabled,
  value,
  options,
  placeholder,
  searchTitle,
  searchNotMatchMessage,
  converter,
  onValueChange,
  onRefresh,
}: SearchableSelectProps<T>) {
  const theValue = value ? converter(value) : undefined;

  const renderItem = (i: T) => {
    const item = converter(i);
    return (
      <CommandItem
        disabled={item.key() === theValue?.key()}
        value={item.key()}
        key={item.key()}
        onSelect={() => {
          onValueChange(item.value);
        }}>
        {item.label()}
        <Check className={cn('ml-auto', item.value === value ? 'opacity-100' : 'opacity-0')} />
      </CommandItem>
    );
  };

  return (
    <Popover>
      <div className="flex justify-between gap-2 items-center">
        <PopoverTrigger asChild disabled={!options.length || disabled}>
          <FormControl>
            <Button
              disabled={!options.length || disabled}
              variant="outline"
              role="combobox"
              className={cn('w-full justify-between', !value && 'text-muted-foreground')}>
              {theValue?.label() ?? placeholder}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        {onRefresh && <Button
          variant="secondary"
          size="icon"
          onClick={onRefresh}>
          <RefreshCwIcon />
        </Button>}
      </div>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={searchTitle} className="h-9" />
          <CommandList>
            <CommandEmpty>{searchNotMatchMessage}</CommandEmpty>
            <CommandGroup>{options.map(renderItem)}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
