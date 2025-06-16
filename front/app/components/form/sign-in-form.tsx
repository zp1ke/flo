import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import type { ApiError } from '~/api/client';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
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

export default function SignInForm() {
  const signIn = useUserStore((state) => state.signIn);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const formSchema = z.object({
    email: z.string().email(t('signIn.validEmail')).max(255, t('signIn.emailMax255')),
    password: z.string().min(3, t('signIn.passwordSize')).max(100, t('signIn.passwordSize')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSignIn = async (data: z.infer<typeof formSchema>) => {
    setProcessing(true);

    const { email, password } = data;

    try {
      await signIn({ email, password });
      navigate('/dashboard', { replace: true });
    } catch (e) {
      toast.error(t('signIn.error'), {
        description: t((e as ApiError).message),
        closeButton: true,
      });
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('signIn.title')}</CardTitle>
          <CardDescription>{t('signIn.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSignIn)} className="space-y-8">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t('signIn.email')}</FormLabel>
                      <FormControl>
                        <Input
                          id="sign-in-email"
                          placeholder={t('signIn.emailPlaceholder')}
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel>{t('signIn.password')}</FormLabel>
                        <Link
                          to="/recover"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          {t('signIn.forgotPassword')}
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          id="sign-in-password"
                          placeholder={t('signIn.passwordPlaceholder')}
                          type="password"
                          required
                          disabled={processing}
                          autoComplete="signin-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={processing}>
                  {processing && <Loader2 className="animate-spin" />}
                  {processing && t('signIn.processing')}
                  {!processing && t('signIn.title')}
                </Button>
              </div>
            </form>
          </Form>
          <div className="flex mt-4 text-center justify-between text-sm">
            <span className="text-muted-foreground">{t('signIn.noAccount')}</span>
            <Link to="/sign-up" className="underline underline-offset-4">
              {t('signUp.title')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
