import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { verifyUser } from '~/api/auth';
import type { ApiError } from '~/api/client';
import AnonContainer from '~/components/layout/anon-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import Loading from '~/components/ui/loading';
import type { Route } from './+types/verify';

export default function Verify({ params }: Route.LoaderArgs) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      verifyUser(params.code)
        .catch((e) => {
          const errorMessage = t((e as ApiError).message);
          toast.error(t('verify.verifyError'), { description: errorMessage, closeButton: true });
          setError(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading, params.code, t]);

  return <AnonContainer placeholderPosition="right">{content(loading, error)}</AnonContainer>;
}

const content = (loading: boolean, error: string | null) => {
  const { t } = useTranslation();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive text-2xl">{t('verify.verifyError')}</CardTitle>
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('verify.verified')}</CardTitle>
        <CardDescription>{t('verify.verifiedDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex mt-4 text-center justify-between text-sm">
          <span className="text-muted-foreground">{t('verify.goSignIn')}</span>
          <Link to="/" className="underline underline-offset-4 ml-2">
            {t('signIn.title')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
