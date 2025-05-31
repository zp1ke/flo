import { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import type { AnonContextType } from '~/components/layout/anon-layout';
import SignUpForm from '~/components/sign-up/sign-up-form';

export default function SignUp() {
  const { setPlaceholderPosition } = useOutletContext<AnonContextType>();

  useEffect(() => {
    setPlaceholderPosition('right');
  }, [setPlaceholderPosition]);

  return <SignUpForm />;
}
