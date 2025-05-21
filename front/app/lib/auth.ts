import type { Profile, User } from '~/types/user';
import config from '~/config';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const USER_KEY_TS = 'auth_user_ts';

export const signIn = async (data: { email: string; password: string }): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = 'test-token';
      setToken(token);
      resolve();
    }, 1000);
  });
};

export const fetchUser = async (): Promise<User | null> => {
  const token = getToken();
  if (!token) {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY_TS);
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const userTs = localStorage.getItem(USER_KEY_TS);
    if (userTs && Date.now() - parseInt(userTs) < config.refreshUserMilliseconds) {
      const user = localStorage.getItem(USER_KEY);
      if (user) {
        console.debug('Fetching user from CACHE...', Date.now());
        return resolve(JSON.parse(user));
      }
    }

    console.debug('Fetching user from API...', Date.now());
    setTimeout(() => {
      const profile = {
        code: token,
        name: 'Mock User',
      } satisfies Profile;
      const user = {
        email: 'mock@mail.com',
        activeProfile: profile,
        profiles: [profile] satisfies Profile[],
      } satisfies User;
      localStorage.setItem(USER_KEY_TS, Date.now().toString());
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      resolve(user);
    }, 1000);
  });
};

export const signOut = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      setToken(null);
      resolve();
    }, 1000);
  });
};

const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};
