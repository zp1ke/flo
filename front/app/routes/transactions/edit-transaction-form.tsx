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
import { Link } from 'react-router';
import { categorySchema, type Category } from '~/types/category';
import { walletSchema, type Wallet } from '~/types/wallet';
import { fetchWallets } from '~/api/wallets';
import { fetchCategories } from '~/api/categories';
import { SearchableSelect, type ValueManager } from '~/components/ui/searchable-select';

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

  const formSchema = z.object({
    description: transactionSchema.shape.description.refine(
      transactionDescriptionIsValid,
      t('transactions.descriptionSize')
    ),
    datetime: transactionSchema.shape.datetime,
    amount: transactionSchema.shape.amount,
    category: categorySchema,
    wallet: walletSchema,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transaction?.description || '',
      datetime: transaction?.datetime || new Date(),
      amount: transaction?.amount || 0,
    },
  });

  const getCategories = async () => {
    const profileCode = user?.activeProfile.code ?? '';
    if (!profileCode) {
      return;
    }
    setFetchingCategories(true);
    const fetchedCategories = await fetchCategories(profileCode, { page: 0, size: 100 });
    if (transaction) {
      const category = fetchedCategories.data.find((c) => c.code === transaction.categoryCode);
      if (category) {
        form.setValue('category', category);
      }
    }
    setFetchingCategories(false);
  };

  const getWallets = async () => {
    const profileCode = user?.activeProfile.code ?? '';
    if (!profileCode) {
      return;
    }
    setFetchingWallets(true);
    const fetchedWallets = await fetchWallets(profileCode, { page: 0, size: 100 });
    if (transaction) {
      const wallet = fetchedWallets.data.find((c) => c.code === transaction.walletCode);
      if (wallet) {
        form.setValue('wallet', wallet);
      }
    }
    setWallets(fetchedWallets.data);
    setFetchingWallets(false);
  };

  useEffect(() => {
    getCategories();
    getWallets();
  }, [user?.activeProfile.code]);

  const toggleProcessing = (value: boolean) => {
    setProcessing(value);
    onProcessing(value);
  };

  const onSave = async (data: z.infer<typeof formSchema>) => {
    toggleProcessing(true);

    const { description, datetime, amount, category, wallet } = data;

    try {
      const transactionData: Transaction = {
        code: transaction?.code,
        description,
        datetime,
        amount,
        categoryCode: category.code!,
        walletCode: wallet.code!,
      };
      const saved = transaction
        ? await updateTransaction(user?.activeProfile.code ?? '-', transactionData)
        : await addTransaction(user?.activeProfile.code ?? '-', transactionData);
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="categoryCode">{t('transactions.category')}</FormLabel>
                <SearchableSelect
                  value={field.value}
                  options={categories}
                  placeholder={t('transactions.categoryPlaceholder')}
                  searchTitle={t('transactions.categorySearchTitle')}
                  searchNotMatchMessage={t('transactions.categorySearchNotMatch')}
                  disabled={processing || !categories.length || fetchingCategories}
                  converter={(category: Category): ValueManager<Category> => ({
                    value: category,
                    key: () => category.code!,
                    label: () => category.name,
                  })}
                  onValueChange={field.onChange}
                  onRefresh={getCategories}
                />
                <FormDescription>
                  {t('transactions.categoriesManageDescription')}{' '}
                  <Link to="/categories" className="underline underline-offset-4" target="_blank">
                    {t('transactions.categoriesManageLink')}
                  </Link>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wallet"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="walletCode">{t('transactions.wallet')}</FormLabel>
                <SearchableSelect
                  value={field.value}
                  options={wallets}
                  placeholder={t('transactions.walletPlaceholder')}
                  searchTitle={t('transactions.walletSearchTitle')}
                  searchNotMatchMessage={t('transactions.walletSearchNotMatch')}
                  disabled={processing || !wallets.length || fetchingWallets}
                  converter={(wallet: Wallet): ValueManager<Wallet> => ({
                    value: wallet,
                    key: () => wallet.code!,
                    label: () => wallet.name,
                  })}
                  onValueChange={field.onChange}
                  onRefresh={getWallets}
                />
                <FormDescription>
                  {t('transactions.walletsManageDescription')}{' '}
                  <Link to="/wallets" className="underline underline-offset-4" target="_blank">
                    {t('transactions.walletsManageLink')}
                  </Link>
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
