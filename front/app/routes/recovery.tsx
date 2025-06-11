import { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import type { AnonContextType } from '~/components/layout/anon-layout';
import RecoveryForm from '~/routes/recovery/recovery-form';
import type { Route } from './+types/recovery';

export default function Recovery({ params }: Route.LoaderArgs) {
  const { setPlaceholderPosition } = useOutletContext<AnonContextType>();

  useEffect(() => {
    setPlaceholderPosition('right');
  }, [setPlaceholderPosition]);

  return <RecoveryForm code={params.code} />;
}
