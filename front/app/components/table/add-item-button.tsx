import type { Table } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { cn } from '~/lib/utils';

export type EditItemFormProps<T> = {
  onProcessing: (processing: boolean) => void;
  onDone: (canceled: boolean) => void;
};

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export const EditItemForm = <T,>({}: EditItemFormProps<T>) => {
  return <></>;
};

interface AddItemButtonProps<T> {
  title: string;
  description: string;
  form: typeof EditItemForm<T>;
  table: Table<T>;
}

export default function AddItemButton<T>({
  title,
  description,
  form,
  table,
}: AddItemButtonProps<T>) {
  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  return (
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="h-4 w-4" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn('sm:max-w-[425px]', processing && '[&>button]:hidden')}
        onInteractOutside={(e) => {
          if (processing) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {form({
          onProcessing: setProcessing,
          onDone: () => {
            setAddOpen(false);
            table.options?.meta?.fetch();
          },
        })}
      </DialogContent>
    </Dialog>
  );
}
