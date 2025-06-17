import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import type { ApiError } from '~/api/client';
import { TypingText } from '~/components/animate-ui/text/typing';
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

export default function SignUpForm() {
  const signUp = useUserStore((state) => state.signUp);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const formSchema = z.object({
    email: z.string().email(t('signUp.validEmail')).max(255, t('signUp.emailMax255')),
    name: z.string().min(3, t('signUp.nameSize')).max(255, t('signUp.nameSize')),
    password: z
      .string()
      .min(3, t('signUp.passwordSize'))
      .max(100, t('signUp.passwordSize'))
      .regex(/(?=.*[0-9])/, t('signUp.validPassword')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  const onSignUp = async (data: z.infer<typeof formSchema>) => {
    setProcessing(true);

    const { email, name, password } = data;

    try {
      await signUp({ email, name, password });
      navigate('/dashboard', { replace: true });
    } catch (e) {
      toast.error(t('signUp.error'), {
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
          <CardTitle className="text-2xl">
            <TypingText text={t('signUp.title')} />
          </CardTitle>
          <CardDescription>
            <TypingText text={t('signUp.description')} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSignUp)} className="space-y-8">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t('signUp.name')}</FormLabel>
                      <FormControl>
                        <Input
                          id="sign-up-name"
                          placeholder={t('signUp.namePlaceholder')}
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t('signUp.email')}</FormLabel>
                      <FormControl>
                        <Input
                          id="sign-up-email"
                          placeholder={t('signUp.emailPlaceholder')}
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
                        <FormLabel>{t('signUp.password')}</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          id="sign-up-password"
                          placeholder={t('signUp.passwordPlaceholder')}
                          type="password"
                          required
                          disabled={processing}
                          autoComplete="sign-up-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={processing}>
                  {processing && <Loader2 className="animate-spin" />}
                  {processing && t('signUp.processing')}
                  {!processing && t('signUp.title')}
                </Button>
              </div>
            </form>
          </Form>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-6">
            {t('signUp.termsParagraphPre')} <a href="/terms">{t('signUp.termsParagraphLink1')}</a>{' '}
            {t('signUp.termsParagraphAnd')} <a href="/privacy">{t('signUp.termsParagraphLink2')}</a>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
