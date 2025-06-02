import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Loading from '~/components/ui/loading';
import { verifyUser } from '~/lib/auth';
import type { RestError } from '~/lib/rest-client';
import type { Route } from './+types/verify';

export default function Verify({ params }: Route.LoaderArgs) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      verifyUser(params.code)
        .catch((e) => {
          const errorMessage = t((e as RestError).message);
          toast.error(t('user.verifyError'), { description: errorMessage });
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
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-destructive text-2xl">{t('user.verifyError')}</p>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-2xl">{t('user.verified')}</p>
    </div>
  );
}
