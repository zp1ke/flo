import type { User } from './user';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignUpRequest extends AuthRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
