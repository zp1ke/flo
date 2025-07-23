import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import type { ApiError } from '~/api/client';
import { addWallet, updateWallet } from '~/api/wallets';
import type { EditItemFormProps } from '~/components/table/add-item-button';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
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
import { type Wallet, walletNameIsValid, walletSchema } from '~/types/wallet';

type EditWalletFormProps = EditItemFormProps & {
  disableCancel?: boolean;
  wallet?: Wallet;
};

export function EditWalletForm({
  disableCancel,
  onDone,
  onProcessing,
  wallet,
}: EditWalletFormProps) {
  const profile = useUserStore((state) => state.profile);

  const { t } = useTranslation();

  const [processing, setProcessing] = useState(false);

  const formSchema = z.object({
    code: walletSchema.shape.code,
    name: walletSchema.shape.name.refine(
      walletNameIsValid,
      t('wallets.nameSize'),
    ),
    balance: walletSchema.shape.balance,
    balanceVisible: walletSchema.shape.balanceVisible,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: wallet?.code,
      name: wallet?.name || '',
      balance: wallet?.balance || 0,
      balanceVisible: wallet?.balanceVisible,
    },
  });

  const toggleProcessing = (value: boolean) => {
    setProcessing(value);
    onProcessing(value);
  };

  const onSave = async (data: z.infer<typeof formSchema>) => {
    toggleProcessing(true);

    const walletData: Wallet = {
      ...data,
    };
    if (!walletData.code) {
      walletData.code = wallet?.code;
    }
    try {
      wallet
        ? await updateWallet(profile?.code ?? '-', walletData)
        : await addWallet(profile?.code ?? '-', walletData);
      onDone(false);
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
            name="code"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>{t('wallets.code')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('wallets.codePlaceholder')}
                    type="text"
                    disabled={processing || !!wallet}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="balance">{t('wallets.balance')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('wallets.balancePlaceholder')}
                    type="number"
                    disabled={processing || !!wallet}
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value
                        ? Number.parseFloat(e.target.value)
                        : 0;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="balanceVisible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={processing}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t('wallets.balanceVisible')}</FormLabel>
                </div>
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
