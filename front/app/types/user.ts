export interface Profile {
  code: string;
  name: string;
}

export interface User {
  email: string;
  activeProfile: Profile;
  profiles: Profile[];
}
