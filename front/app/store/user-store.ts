import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signOut, signUp } from '~/api/auth';
import { fetchProfiles } from '~/api/profiles';
import type { AuthRequest as SignInRequest, SignUpRequest } from '~/types/auth';
import type { Profile } from '~/types/profile';
import type { User } from '~/types/user';

interface UserStore {
  token: string | null;
  user: User | null;

  signUp: (request: SignUpRequest) => Promise<void>;
  signIn: (request: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;

  profile: Profile | null;
  setProfile: (profile: Profile) => void;

  profiles: Profile[];
  loadProfiles: () => Promise<void>;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      token: null as string | null,
      user: null as User | null,
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
        set({ token: null, user: null });
      },

      profile: null as Profile | null,
      setProfile: (profile: Profile) => set({ profile }),

      profiles: [] as Profile[],
      loadProfiles: async () => {
        const { user } = get();
        if (user) {
          console.debug('Loading profiles from API...');
          try {
            const profiles = await fetchProfiles();
            set((state) => ({
              profiles: profiles.data as Profile[],
              profile: state.profile || profiles.data[0] || null,
            }));
          } catch (error) {
            console.error('Failed to load profiles:', error);
          }
        }
      },
    }),
    {
      name: 'user-store',
    }
  )
);

export default useUserStore;
