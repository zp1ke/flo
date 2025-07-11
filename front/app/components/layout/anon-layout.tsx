import { useState } from 'react';
import { Outlet, redirect } from 'react-router';
import useUserStore from '~/store/user-store';
import type { HorizontalPosition } from '~/types/position';
import AnonContainer from './anon-container';

export async function clientLoader() {
  const user = useUserStore.getState().user;
  if (user) {
    return redirect('/dashboard');
  }
}

export type AnonContextType = {
  setPlaceholderPosition: (position: HorizontalPosition) => void;
};

export default function AnonLayout() {
  const [placeholderPosition, setPlaceholderPosition] =
    useState<HorizontalPosition>('left');

  return (
    <AnonContainer placeholderPosition={placeholderPosition}>
      <Outlet context={{ setPlaceholderPosition }} />
    </AnonContainer>
  );
}
