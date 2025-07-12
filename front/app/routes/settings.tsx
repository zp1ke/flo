'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircleIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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

  const [emailIsChanged, setEmailIsChanged] = useState(false);
  const [hasVerifyCode, setHasVerifyCode] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [verifyAvailableAt, setVerifyAvailableAt] = useState<Date | null>(null);
  const [secondsToVerify, setSecondsToVerify] = useState(0);

  useEffect(() => {
    if (verifyAvailableAt) {
      setSecondsToVerify(secondsUntil(verifyAvailableAt));
      const interval = setInterval(() => {
        const seconds = secondsUntil(verifyAvailableAt);
        setSecondsToVerify(seconds);
        if (seconds <= 0) {
          clearInterval(interval);
          setVerifyAvailableAt(null);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    setSecondsToVerify(0);
  }, [verifyAvailableAt]);

  const formSchema = z.object({
    emailVerifyCode: z.string().optional(),
    email: z
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

  const sendVerification = async () => {
    setProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call delay

    const nextAvailableAt = new Date();
    nextAvailableAt.setSeconds(nextAvailableAt.getSeconds() + 120); // Set available time to 120 seconds from now
    setVerifyAvailableAt(nextAvailableAt);
    setProcessing(false);
  };

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

  const needsVerifyCode = () => {
    return emailIsChanged && !hasVerifyCode;
  };

  return (
    <PageContent title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-2/3 space-y-6 pt-2 md:pt-4 max-w-[500px]"
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
                      disabled={processing || exporting}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setEmailIsChanged(e.target.value !== user?.email);
                      }}
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
            name="emailVerifyCode"
            render={({ field }) => {
              if (!emailIsChanged) {
                return <div />;
              }

              return (
                <FormItem className="grid gap-2">
                  <FormLabel>{t('settings.emailVerifyCode')}</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder={t('settings.emailVerifyCodePlaceholder')}
                        type="text"
                        required={emailIsChanged}
                        disabled={processing || exporting}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setHasVerifyCode(e.target.value.length > 0);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t('settings.emailVerifyCodeDescription')}
                  </FormDescription>
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
                    disabled={processing || exporting}
                    autoComplete="settings-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            {(!user?.verified || needsVerifyCode()) && (
              <Button
                type="button"
                variant="outline"
                disabled={processing || exporting || secondsToVerify > 0}
                onClick={sendVerification}
              >
                {processing && <Loader2 className="animate-spin" />}
                {processing && t('settings.processing')}
                {!processing &&
                  !secondsToVerify &&
                  t('settings.sendVerificationCode')}
                {secondsToVerify > 0 &&
                  t('settings.sendVerificationAvailableIn', {
                    seconds: secondsToVerify,
                  })}
              </Button>
            )}
            <Button
              type="submit"
              disabled={processing || exporting || needsVerifyCode()}
            >
              {processing && <Loader2 className="animate-spin" />}
              {processing && t('settings.processing')}
              {!processing && t('settings.saveChanges')}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={processing || exporting}
              onClick={() => setExporting(true)}
            >
              {exporting && <Loader2 className="animate-spin" />}
              {exporting && t('settings.exporting')}
              {!exporting && t('settings.exportData')}
            </Button>
          </div>
        </form>
      </Form>
    </PageContent>
  );
}

const secondsUntil = (date: Date | null): number => {
  if (!date) {
    return 0;
  }
  const now = new Date();
  const milliDiff = date.getTime() - now.getTime();
  const secondsDiff = Math.floor(milliDiff / 1000);
  if (secondsDiff <= 0) {
    return 0;
  }
  return secondsDiff;
};
