import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Loading from '~/components/ui/loading';
import { verifyUser } from '~/lib/auth';
import type { RestError } from '~/lib/rest-client';
import type { Route } from './+types/verify';
import { Link } from 'react-router';

export default function Verify({ params }: Route.LoaderArgs) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      verifyUser(params.code)
        .catch((e) => {
          const errorMessage = t((e as RestError).message);
          toast.error(t('verify.verifyError'), { description: errorMessage, closeButton: true });
          setError(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-full w-full justify-center flex-col">
        <p className="text-destructive text-xl">{t('verify.verifyError')}</p>
        <p className="text-destructive mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center flex-col">
      <p className="text-2xl">{t('verify.verified')}</p>
      <div className="flex mt-4 text-center justify-between text-sm">
        <span className="text-muted-foreground">{t('verify.nextStep')}</span>
        <Link to="/" className="underline underline-offset-4 ml-2">
          {t('signIn.title')}
        </Link>
      </div>
    </div>
  );
}
