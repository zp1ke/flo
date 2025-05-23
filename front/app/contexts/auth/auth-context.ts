import { createContext } from 'react';
import type { Profile } from '~/types/profile';
import type { User } from '~/types/user';

interface AuthContextType {
  user: User | null;
  saveProfile: (profile: Profile, setDefault: boolean) => Promise<Profile>;
  activateProfile: (profile: Profile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
