import { ChevronDownIcon } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import type { Matcher } from 'react-day-picker';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Label } from '~/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { getLanguage } from '~/lib/i18n';
import { cn } from '~/lib/utils';

interface DatePickerProps {
  title?: string;
  placeholder?: string;
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DatePicker({
  title,
  placeholder,
  value,
  minDate,
  maxDate,
  onChange,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const id = useId();

  const formatDate = () => {
    if (!value) {
      return placeholder ?? '';
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const datetime = new Date(value);
    return datetime.toLocaleDateString(getLanguage(), options);
  };

  const hidden = useMemo(() => {
    const matchers: Matcher[] = [];
    if (minDate) {
      matchers.push({ before: minDate });
    }
    if (maxDate) {
      matchers.push({ after: maxDate });
    }
    return matchers;
  }, [minDate, maxDate]);

  return (
    <div className="flex flex-col gap-3">
      {title && (
        <Label htmlFor={id} className="px-1">
          {title}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className={cn(
              'w-48 justify-between font-normal',
              !value && 'text-muted-foreground',
            )}
            disabled={disabled}
          >
            {formatDate()}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            hidden={hidden}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
