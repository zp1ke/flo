import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchUser, signIn, signOut, signUp } from '~/api/auth';
import { fetchProfiles } from '~/api/profiles';
import type { AuthRequest as SignInRequest, SignUpRequest } from '~/types/auth';
import type { Profile } from '~/types/profile';
import type { User } from '~/types/user';

interface UserStore {
  loading: boolean;

  token: string | null;
  user: User | null;
  fetchUser: () => Promise<void>;

  signUp: (request: SignUpRequest) => Promise<void>;
  signIn: (request: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
  clean: () => void;

  profile: Profile | null;
  setProfile: (profile: Profile) => void;

  profiles: Profile[];
  loadProfiles: (throwOnError?: boolean) => Promise<void>;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      loading: false,

      token: null as string | null,
      user: null as User | null,
      fetchUser: async () => {
        const { token } = get();
        if (token) {
          set({ loading: true });
          console.debug('Fetching user from API...');
          try {
            const user = await fetchUser();
            set({ user, loading: false });
          } catch (error) {
            console.error('Failed to fetch user:', error);
            set({ loading: false });
          }
        }
      },

      signUp: async (request: SignUpRequest) => {
        const authResponse = await signUp(request);
        set({ token: authResponse.token, user: authResponse.user });
      },
      signIn: async (request: SignInRequest) => {
        const authResponse = await signIn(request);
        set({ token: authResponse.token, user: authResponse.user });
      },
      signOut: async () => {
        await signOut();
        get().clean();
      },
      clean: () =>
        set({ token: null, user: null, profile: null, profiles: [] }),

      profile: null as Profile | null,
      setProfile: (profile: Profile) => set({ profile }),

      profiles: [] as Profile[],
      loadProfiles: async (throwOnError?: boolean) => {
        const { user } = get();
        if (user) {
          set({ loading: true });
          console.debug('Loading profiles from API...');

          try {
            const profiles = await fetchProfiles();
            set((state) => {
              const activeProfile =
                profiles.data.find((p) => p.code === state.profile?.code) ??
                profiles.data[0] ??
                null;

              return {
                profiles: profiles.data as Profile[],
                profile: activeProfile,
                loading: false,
              };
            });
          } catch (error) {
            console.error('Failed to load profiles:', error);
            set({ loading: false });
            if (throwOnError) {
              throw error;
            }
          }
        }
      },
    }),
    {
      name: 'user-store',
    },
  ),
);

export default useUserStore;
