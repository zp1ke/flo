import { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import type { AnonContextType } from '~/components/layout/anon-layout';
import RecoverForm from '~/routes/recover/recover-form';

export default function Recover() {
  const { setPlaceholderPosition } = useOutletContext<AnonContextType>();

  useEffect(() => {
    setPlaceholderPosition('right');
  }, [setPlaceholderPosition]);

  return <RecoverForm />;
}
