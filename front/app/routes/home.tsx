import { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import SignInForm from '~/components/form/sign-in-form';
import type { AnonContextType } from '~/components/layout/anon-layout';

export default function Home() {
  const { setPlaceholderPosition } = useOutletContext<AnonContextType>();

  useEffect(() => {
    setPlaceholderPosition('left');
  }, [setPlaceholderPosition]);

  return <SignInForm />;
}
