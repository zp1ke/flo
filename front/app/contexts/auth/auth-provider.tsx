import { type ReactNode, useEffect, useState } from 'react';
import config from '~/config';
import { fetchUser, saveUserProfile, setActiveProfile } from '~/lib/auth';
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

  const saveProfile = async (profile: Profile, setDefault: boolean): Promise<Profile> => {
    const userProfile = await saveUserProfile(profile, setDefault);
    setUser(userProfile.user);
    return userProfile.profile;
  };

  const activateProfile = async (profile: Profile): Promise<void> => {
    const theUser = await setActiveProfile(profile);
    setUser(theUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, saveProfile, activateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
