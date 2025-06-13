import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, RefreshCwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { type ApiError } from '~/api/client';
import useAuth from '~/contexts/auth/use-auth';
import {
  transactionDescriptionIsValid,
  transactionSchema,
  type Transaction,
} from '~/types/transaction';
import { addTransaction, updateTransaction } from '~/api/transactions';
import { DateTimePicker } from '~/components/ui/datetime-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Link } from 'react-router';
import type { Category } from '~/types/category';
import type { Wallet } from '~/types/wallet';
import { fetchWallets } from '~/api/wallets';
import { fetchCategories } from '~/api/categories';

export function EditTransactionForm({
  disableCancel,
  onCancel,
  onProcessing,
  onSaved,
  transaction,
}: {
  disableCancel?: boolean;
  onCancel: () => void;
  onProcessing: (processing: boolean) => void;
  onSaved: (transaction: Transaction) => Promise<void>;
  transaction?: Transaction;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingWallets, setFetchingWallets] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const getCategories = async () => {
    const profileCode = user?.activeProfile.code ?? '';
    if (!profileCode) {
      return;
    }
    setFetchingCategories(true);
    const fetchedCategories = await fetchCategories(profileCode, { page: 0, size: 100 });
    setCategories(fetchedCategories.data);
    setFetchingCategories(false);
  };

  const getWallets = async () => {
    const profileCode = user?.activeProfile.code ?? '';
    if (!profileCode) {
      return;
    }
    setFetchingWallets(true);
    const fetchedWallets = await fetchWallets(profileCode, { page: 0, size: 100 });
    setWallets(fetchedWallets.data);
    setFetchingWallets(false);
  };

  useEffect(() => {
    getCategories();
    getWallets();
  }, [user?.activeProfile.code]);

  const formSchema = z.object({
    description: transactionSchema.shape.description.refine(
      transactionDescriptionIsValid,
      t('transactions.descriptionSize')
    ),
    datetime: transactionSchema.shape.datetime,
    amount: transactionSchema.shape.amount,
    categoryCode: transactionSchema.shape.categoryCode,
    walletCode: transactionSchema.shape.walletCode,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transaction?.description || '',
      datetime: transaction?.datetime || new Date(),
      amount: transaction?.amount || 0,
      categoryCode: transaction?.categoryCode || '',
      walletCode: transaction?.walletCode || '',
    },
  });

  const toggleProcessing = (value: boolean) => {
    setProcessing(value);
    onProcessing(value);
  };

  const onSave = async (data: z.infer<typeof formSchema>) => {
    toggleProcessing(true);

    try {
      const saved = transaction
        ? await updateTransaction(user?.activeProfile.code ?? '-', {
          code: transaction?.code,
          ...data,
        } satisfies Transaction)
        : await addTransaction(user?.activeProfile.code ?? '-', data satisfies Transaction);
      await onSaved(saved);
      form.reset();
    } catch (e) {
      toast.error(t('transactions.fetchError'), {
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
            name="description"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="description">{t('transactions.description')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('transactions.descriptionPlaceholder')}
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
            name="datetime"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="datetime">{t('transactions.datetime')}</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('transactions.datetimePlaceholder')}
                    disabled={processing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="amount">{t('transactions.amount')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('transactions.amountPlaceholder')}
                    type="number"
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
            name="categoryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="categoryCode">{t('transactions.category')}</FormLabel>
                <div className="form-item flex justify-between gap-2 items-center">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={processing || !categories.length}>
                    <FormControl className='w-full'>
                      <SelectTrigger>
                        <SelectValue placeholder={t('transactions.categoryPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.code} value={category.code!}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="secondary" size="icon" disabled={processing || fetchingCategories} onClick={getCategories}>
                    <RefreshCwIcon />
                  </Button>
                </div>
                <FormDescription>
                  {t('transactions.categoriesManageDescription')}{' '}
                  <Link to="/categories" className="underline underline-offset-4" target='_blank'>{t('transactions.categoriesManageLink')}</Link>.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="walletCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="walletCode">{t('transactions.wallet')}</FormLabel>
                <div className="form-item flex justify-between gap-2 items-center">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={processing || !wallets.length}>
                    <FormControl className='w-full'>
                      <SelectTrigger>
                        <SelectValue placeholder={t('transactions.walletPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.code} value={wallet.code!}>
                          {wallet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="secondary" size="icon" disabled={processing || fetchingWallets} onClick={getWallets}>
                    <RefreshCwIcon />
                  </Button>
                </div>
                <FormDescription>
                  {t('transactions.walletsManageDescription')}{' '}
                  <Link to="/wallets" className="underline underline-offset-4" target='_blank'>{t('transactions.walletsManageLink')}</Link>.
                </FormDescription>
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
              {t('transactions.cancel')}
            </Button>
          )}
          <Button type="submit" disabled={processing} className="ml-auto flex">
            {processing && <Loader2 className="animate-spin" />}
            {processing && t('transactions.processing')}
            {!processing && t('transactions.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
