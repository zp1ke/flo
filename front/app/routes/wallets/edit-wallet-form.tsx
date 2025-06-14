import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
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
import type { ApiError } from '~/api/client';
import useAuth from '~/contexts/auth/use-auth';
import { walletNameIsValid, walletSchema, type Wallet } from '~/types/wallet';
import { addWallet, updateWallet } from '~/api/wallets';

export function EditWalletForm({
  disableCancel,
  onCancel,
  onProcessing,
  onSaved,
  wallet,
}: {
  disableCancel?: boolean;
  onCancel: () => void;
  onProcessing: (processing: boolean) => void;
  onSaved: (wallet: Wallet) => Promise<void>;
  wallet?: Wallet;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [processing, setProcessing] = useState(false);

  const formSchema = z.object({
    name: walletSchema.shape.name.refine(walletNameIsValid, t('wallets.nameSize')),
    setDefault: z.boolean().default(true).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: wallet?.name || '',
    },
  });

  const toggleProcessing = (value: boolean) => {
    setProcessing(value);
    onProcessing(value);
  };

  const onSave = async (data: z.infer<typeof formSchema>) => {
    toggleProcessing(true);

    const { name } = data;

    try {
      const saved = wallet
        ? await updateWallet(user?.activeProfile.code ?? '-', {
            code: wallet?.code,
            name,
          } satisfies Wallet)
        : await addWallet(user?.activeProfile.code ?? '-', { name } satisfies Wallet);
      await onSaved(saved);
      form.reset();
    } catch (e) {
      toast.error(t('wallets.saveError'), {
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
                <FormLabel>{t('wallets.name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('wallets.namePlaceholder')}
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
              onClick={onCancel}>
              {t('wallets.cancel')}
            </Button>
          )}
          <Button type="submit" disabled={processing} className="ml-auto flex">
            {processing && <Loader2 className="animate-spin" />}
            {processing && t('wallets.processing')}
            {!processing && t('wallets.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
