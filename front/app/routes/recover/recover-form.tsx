import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { sendEmailRecover } from '~/api/auth';
import type { ApiError } from '~/api/client';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

export default function RecoverForm() {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const [sent, setSent] = useState(false);

  const formSchema = z.object({
    email: z.email(t('recover.validEmail')).max(255, t('recover.emailMax255')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onRecover = async (data: z.infer<typeof formSchema>) => {
    setProcessing(true);

    const { email } = data;

    try {
      await sendEmailRecover(email);
      setSent(true);
    } catch (e) {
      toast.error(t('recover.error'), {
        description: t((e as ApiError).message),
        closeButton: true,
      });
    } finally {
      setProcessing(false);
    }
  };

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('recover.sent')}</CardTitle>
          <CardDescription>{t('recover.sentDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mt-4 text-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('recover.goSignIn')}
            </span>
            <Link to="/" className="underline underline-offset-4 ml-2">
              {t('signIn.title')}
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('recover.title')}</CardTitle>
          <CardDescription>{t('recover.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onRecover)} className="space-y-8">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t('recover.email')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('recover.emailPlaceholder')}
                          type="email"
                          required
                          disabled={processing}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={processing}>
                  {processing && <Loader2 className="animate-spin" />}
                  {processing && t('recover.processing')}
                  {!processing && t('recover.title')}
                </Button>
              </div>
            </form>
          </Form>
          <div className="flex mt-4 text-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('recover.noAccount')}
            </span>
            <Link to="/sign-up" className="underline underline-offset-4">
              {t('signUp.title')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
