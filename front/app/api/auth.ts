import config from '~/config';
import type { Profile } from '~/types/profile';
import type { User } from '~/types/user';

import { addProfile, updateProfile } from './profiles';
import apiClient, { type ApiError } from './client';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const USER_KEY_TS = 'auth_user_ts';

const authPath = '/auth';
const userPath = '/user';

interface AuthRequest {
  email: string;
  password: string;
}

interface SignUpRequest extends AuthRequest {
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface RecoveryRequest extends AuthRequest {
  code: string;
}

export const signUp = async (data: SignUpRequest): Promise<void> => {
  const authResponse = await apiClient.postJson<AuthResponse>(`${authPath}/sign-up`, data);
  setAuthToken(authResponse.token);
  await fetchUser(true);
};

export const signIn = async (data: AuthRequest): Promise<void> => {
  const authResponse = await apiClient.postJson<AuthResponse>(`${authPath}/sign-in`, {
    ...data,
    username: data.email,
  });
  setAuthToken(authResponse.token);
  await fetchUser(true);
};

export const sendEmailRecover = async (email: String): Promise<void> => {
  await apiClient.postJson<AuthResponse>(`${authPath}/recover`, {
    email,
  });
};

export const recoverPassword = async (data: RecoveryRequest): Promise<void> => {
  await apiClient.postJson<AuthResponse>(`${authPath}/recovery/${data.code}`, {
    ...data,
    username: data.email,
  });
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

  const userTs = localStorage.getItem(USER_KEY_TS);
  let activeProfileCode: string | null = null;
  let cachedUser: User | null = null;
  if (userTs) {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      cachedUser = JSON.parse(user);
      if (!force && Date.now() - parseInt(userTs) < config.refreshUserMilliseconds) {
        console.debug('Using user from CACHE...', Date.now());
        return Promise.resolve(cachedUser);
      } else {
        activeProfileCode = cachedUser?.activeProfile?.code || null;
      }
    }
  }

  console.debug('Fetching user from API...', Date.now());
  try {
    const userProfiles = await apiClient.getJson<UserProfiles>(`${userPath}/me`);
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
    return user;
  } catch (e) {
    console.error('Error fetching user:', e);
    const apiStatus = (e as ApiError).status;
    if (apiStatus === 401 || apiStatus === 403) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(USER_KEY_TS);
      return null;
    }
    if (cachedUser) {
      return cachedUser;
    }
    throw e;
  }
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
  await apiClient.postJson(`${userPath}/sign-out`, {});
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
  await apiClient.postJson(`${authPath}/verify/${code}`);
};
