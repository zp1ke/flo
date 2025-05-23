import type { Profile } from './profile';

export interface User {
  email: string;
  activeProfile: Profile;
  profiles: Profile[];
}
