import { type ReactNode, useEffect, useState } from 'react';
import config from '~/config';
import { fetchUser, saveUserProfile, setActiveProfile } from '~/api/auth';
import type { Profile } from '~/types/profile';
import type { User } from '~/types/user';

import AuthContext from './auth-context';

const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  let refreshing = true;
  const finishRefreshing = () => {
    refreshing = false;
  };
  const refresh = () => {
    if (refreshing) {
      fetchUser(true).then((user) => {
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

  const saveProfile = async (profile: Profile, setDefault: boolean): Promise<Profile> => {
    const userProfile = await saveUserProfile(profile, setDefault);
    setUser(userProfile.user);
    return userProfile.profile;
  };

  const activateProfile = async (profile: Profile): Promise<void> => {
    const theUser = await setActiveProfile(profile);
    setUser(theUser);
  };

  const refreshUser = async (): Promise<User | null> => {
    const user = await fetchUser(true);
    setUser(user);
    return user;
  };

  return (
    <AuthContext.Provider value={{ user, saveProfile, activateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
