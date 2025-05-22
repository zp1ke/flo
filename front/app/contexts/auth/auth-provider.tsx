import { type ReactNode, useEffect, useState } from 'react';
import config from '~/config';
import { fetchUser } from '~/lib/auth';
import type { User } from '~/types/user';

import AuthContext from './auth-context';

const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  let refreshing = true;
  const finishRefreshing = () => {
    refreshing = false;
  };
  const refresh = () => {
    if (refreshing) {
      fetchUser().then((user) => {
        callback(user);
      });
      setTimeout(refresh, config.refreshUserMilliseconds);
    }
  };
  refresh();
  return finishRefreshing;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
