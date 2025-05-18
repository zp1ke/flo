export interface Profile {
  code: string;
  name: string;
}

export interface User {
  token: string;
  email: string;

  profile: Profile;
}
