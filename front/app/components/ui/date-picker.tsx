import { ChevronDownIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Label } from '~/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { getLanguage } from '~/lib/i18n';

interface DatePickerProps {
  title?: string;
  placeholder?: string;
  value?: Date;
  maxDate?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DatePicker({
  title,
  placeholder,
  value,
  onChange,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);

  const id = useId();

  const formatDate = () => {
    if (!date) {
      return placeholder ?? '';
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const datetime = new Date(date);
    return datetime.toLocaleDateString(getLanguage(), options);
  };

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
            className="w-48 justify-between font-normal"
          >
            {formatDate()}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            hidden={{ after: new Date(), before: new Date(2025, 5, 1) }}
            onSelect={(date) => {
              setDate(date);
              onChange?.(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
