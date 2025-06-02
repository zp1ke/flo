import config from '~/config';
import type { Profile } from '~/types/profile';
import type { User } from '~/types/user';

import { addProfile, updateProfile } from './profiles';
import restClient from './rest-client';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const USER_KEY_TS = 'auth_user_ts';

const basePath = '/auth';

interface AuthResponse {
  token: string;
  user: User;
}

export const signIn = async (data: { email: string; password: string }): Promise<void> => {
  const authResponse = await restClient.postJson<AuthResponse>(`${basePath}/sign-in`, {
    username: data.email,
    password: data.password,
  });
  setAuthToken(authResponse.token);
  await fetchUser(true);
};

interface UserProfiles {
  user: User;
  profiles: Profile[];
}

export const fetchUser = async (force: boolean): Promise<User | null> => {
  const token = getAuthToken();
  if (!token) {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY_TS);
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const userTs = localStorage.getItem(USER_KEY_TS);
    let activeProfileCode: string | null = null;
    if (userTs) {
      const user = localStorage.getItem(USER_KEY);
      if (user) {
        if (!force && Date.now() - parseInt(userTs) < config.refreshUserMilliseconds) {
          console.debug('Fetching user from CACHE...', Date.now());
          return resolve(JSON.parse(user));
        } else {
          const parsedUser: User = JSON.parse(user);
          activeProfileCode = parsedUser.activeProfile?.code || null;
        }
      }
    }

    console.debug('Fetching user from API...', Date.now());
    restClient
      .getJson<UserProfiles>(`${basePath}/me`)
      .then((userProfiles) => {
        const user = userProfiles.user;
        user.profiles = userProfiles.profiles;
        if (!user.activeProfile) {
          user.activeProfile = user.profiles[0];
          if (activeProfileCode) {
            const activeProfile = user.profiles.find((p) => p.code === activeProfileCode);
            if (activeProfile) {
              user.activeProfile = activeProfile;
            }
          }
        }

        localStorage.setItem(USER_KEY_TS, Date.now().toString());
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        resolve(user);
      })
      .catch(reject);
  });
};

export const saveUserProfile = async (
  profile: Profile,
  setDefault: boolean
): Promise<{ user: User; profile: Profile }> => {
  let user = await fetchUser(false);
  if (!user) {
    throw new Error('user.notFound');
  }

  let savedProfile: Profile;
  if (!profile.code) {
    savedProfile = await addProfile(profile);
  } else {
    savedProfile = await updateProfile(profile);
  }

  await fetchUser(true);
  if (setDefault) {
    await setActiveProfile(savedProfile);
  }
  return { user, profile: savedProfile };
};

export const setActiveProfile = async (profile: Profile): Promise<User> => {
  const user = await fetchUser(false);
  if (!user) {
    throw new Error('user.notFound');
  }

  user.activeProfile = profile;

  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
};

export const signOut = async (): Promise<void> => {
  await restClient.postJson(`${basePath}/sign-out`, {});
  setAuthToken(null);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const verifyUser = async (code: string): Promise<void> => {
  await restClient.postJson(`${basePath}/verify/${code}`);
};
