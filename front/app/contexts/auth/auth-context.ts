import { createContext } from 'react';
import type { User } from '~/types/user';

interface AuthContextType {
  user: User | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
