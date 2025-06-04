import { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import type { AnonContextType } from '~/components/layout/anon-layout';
import type { Route } from './+types/recovery';
import RecoveryForm from '~/components/recovery/recovery-form';

export default function Recovery({ params }: Route.LoaderArgs) {
  const { setPlaceholderPosition } = useOutletContext<AnonContextType>();

  useEffect(() => {
    setPlaceholderPosition('right');
  }, [setPlaceholderPosition]);

  return <RecoveryForm code={params.code} />;
}
