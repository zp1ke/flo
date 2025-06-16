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
  onSaved: (item: T) => Promise<void>;
  onProcessing: (processing: boolean) => void;
  onCancel: () => void;
};

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export const EditItemForm = <T,>({}: EditItemFormProps<T>) => {
  return <></>;
};

interface AddItemButtonProps<T> {
  title: string;
  description: string;
  form: typeof EditItemForm<T>;
  onAdded: (item: T) => void;
}

export default function AddItemButton<T>({
  title,
  description,
  form,
  onAdded,
}: AddItemButtonProps<T>) {
  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onAddedItem = async (item: T) => {
    setAddOpen(false);
    onAdded(item);
  };

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
          onSaved: onAddedItem,
          onProcessing: setProcessing,
          onCancel: () => setAddOpen(false),
        })}
      </DialogContent>
    </Dialog>
  );
}
