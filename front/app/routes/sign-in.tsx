import { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import SignInForm from '~/components/home/sign-in-form';
import type { AnonContextType } from '~/components/layout/anon-layout';

export default function SignIn() {
  const { setPlaceholderPosition } = useOutletContext<AnonContextType>();

  useEffect(() => {
    setPlaceholderPosition('left');
  }, [setPlaceholderPosition]);

  return <SignInForm />;
}
