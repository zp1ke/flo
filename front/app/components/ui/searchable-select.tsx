import { Check, ChevronsUpDown } from 'lucide-react';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';

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
}: SearchableSelectProps<T>) {
  const theValue = value ? converter(value) : undefined;

  const [open, setOpen] = useState(false);

  const renderItem = (i: T) => {
    const item = converter(i);
    const selected = theValue?.key() === item.key();
    return (
      <CommandItem
        disabled={selected}
        value={item.label()}
        key={item.key()}
        onSelect={() => {
          onValueChange(item.value);
          setOpen(false);
        }}
      >
        {item.label()}
        <Check className={cn('ml-auto', selected ? 'opacity-100' : 'opacity-0')} />
      </CommandItem>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={!options.length || disabled}>
        <Button
          disabled={!options.length || disabled}
          variant="outline"
          className={cn('w-full justify-between', !value && 'text-muted-foreground')}
        >
          {theValue?.label() ?? placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
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
