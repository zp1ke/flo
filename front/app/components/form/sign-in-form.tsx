import { type FormEvent, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Link, useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signIn } from '~/lib/auth';

export default function SignInForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const onSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';

    await signIn({ email, password });
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('signIn.title')}</CardTitle>
          <CardDescription>{t('signIn.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSignIn}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('signIn.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  required
                  disabled={processing}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('signIn.password')}</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    {t('signIn.forgotPassword')}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={processing}
                  autoComplete="signin-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={processing}>
                {processing && <Loader2 className="animate-spin" />}
                {processing && t('signIn.processing')}
                {!processing && t('signIn.title')}
              </Button>
            </div>
            <div className="flex mt-4 text-center justify-between text-sm">
              <span className="text-muted-foreground">{t('signIn.noAccount')}</span>
              <Link to="/signup" className="underline underline-offset-4">
                {t('signUp.title')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
