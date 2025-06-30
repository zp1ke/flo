'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircleIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import PageContent from '~/components/layout/page-content';

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import useUserStore from '~/store/user-store';

export default function Settings() {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);

  const [processing, setProcessing] = useState(false);

  const formSchema = z.object({
    emailVerifyCode: z
      .string()
      .optional(),
    email: z
      .string()
      .email(t('settings.validEmail'))
      .max(255, t('settings.emailMax255')),
    password: z
      .string()
      .min(3, t('settings.passwordSize'))
      .max(100, t('settings.passwordSize'))
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
      emailVerifyCode: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setProcessing(true);

    toast('TODO: api call. You submitted the following values', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const emailIsChanged = () => {
    return user?.email !== form.getValues('email');
  };

  const needsVerifyCode = () => {
    return emailIsChanged() && !form.getValues('emailVerifyCode');
  };

  return (
    <PageContent title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6 pt-2 md:pt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>{t('settings.email')}</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      placeholder={t('settings.emailPlaceholder')}
                      type="email"
                      required
                      disabled={processing}
                      {...field}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CheckCircleIcon
                          className={cn(
                            'h-4 w-4',
                            user?.verified
                              ? 'text-green-500'
                              : 'text-destructive',
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {t(
                            user?.verified
                              ? 'settings.emailVerified'
                              : 'settings.emailNotVerified',
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              const emailChanged = emailIsChanged();
              if (!emailChanged) {
                return <div />;
              }

              return (<FormItem className="grid gap-2">
                <FormLabel>{t('settings.emailVerifyCode')}</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      placeholder={t('settings.emailVerifyCodePlaceholder')}
                      type="text"
                      required={emailChanged}
                      disabled={processing}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>{t('settings.emailVerifyCodeDescription')}</FormDescription>
                <FormMessage />
              </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <div className="flex items-center">
                  <FormLabel>{t('settings.changePassword')}</FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder={t('settings.passwordPlaceholder')}
                    type="password"
                    required
                    disabled={processing}
                    autoComplete="settings-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            {(user?.verified || !needsVerifyCode()) || (
              <Button type="button" variant="outline" disabled={processing}>
                {processing && <Loader2 className="animate-spin" />}
                {processing && t('settings.processing')}
                {!processing && t('settings.sendVerificationEmail')}
              </Button>
            )}
            <Button type="submit" disabled={processing || needsVerifyCode()}>
              {processing && <Loader2 className="animate-spin" />}
              {processing && t('settings.processing')}
              {!processing && t('settings.saveChanges')}
            </Button>
          </div>
        </form>
      </Form>
    </PageContent>
  );
}
