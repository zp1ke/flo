import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import { addCategory, updateCategory } from '~/api/categories';
import type { ApiError } from '~/api/client';
import type { EditItemFormProps } from '~/components/table/add-item-button';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import useUserStore from '~/store/user-store';
import {
  type Category,
  categoryNameIsValid,
  categorySchema,
} from '~/types/category';

type EditCategoryFormProps = EditItemFormProps & {
  disableCancel?: boolean;
  category?: Category;
};

export function EditCategoryForm({
  disableCancel,
  onProcessing,
  onDone,
  category,
}: EditCategoryFormProps) {
  const profile = useUserStore((state) => state.profile);

  const { t } = useTranslation();

  const [processing, setProcessing] = useState(false);

  const formSchema = z.object({
    name: categorySchema.shape.name.refine(
      categoryNameIsValid,
      t('categories.nameSize'),
    ),
    setDefault: z.boolean().default(true).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
    },
  });

  const toggleProcessing = (value: boolean) => {
    setProcessing(value);
    onProcessing(value);
  };

  const onSave = async (data: z.infer<typeof formSchema>) => {
    toggleProcessing(true);

    const { name } = data;

    const categoryData: Category = {
      code: category?.code,
      name,
    };
    try {
      category
        ? await updateCategory(profile?.code ?? '-', categoryData)
        : await addCategory(profile?.code ?? '-', categoryData);
      onDone(false);
      form.reset();
    } catch (e) {
      toast.error(t('categories.saveError'), {
        description: t((e as ApiError).message),
        closeButton: true,
      });
    } finally {
      toggleProcessing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>{t('categories.name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('categories.namePlaceholder')}
                    type="text"
                    required
                    disabled={processing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between">
          {!disableCancel && (
            <Button
              type="button"
              variant="secondary"
              disabled={processing}
              className="flex"
              onClick={() => onDone(true)}
            >
              {t('categories.cancel')}
            </Button>
          )}
          <Button type="submit" disabled={processing} className="ml-auto flex">
            {processing && <Loader2 className="animate-spin" />}
            {processing && t('categories.processing')}
            {!processing && t('categories.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
