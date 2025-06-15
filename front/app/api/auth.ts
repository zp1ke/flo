import apiClient from './client';
import type { AuthRequest, AuthResponse, SignUpRequest } from '~/types/auth';

const authPath = '/auth';
const userPath = '/user';

interface RecoveryRequest extends AuthRequest {
  code: string;
}

export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
  return apiClient.postJson<AuthResponse>(`${authPath}/sign-up`, data);
};

export const signIn = async (data: AuthRequest): Promise<AuthResponse> => {
  return apiClient.postJson<AuthResponse>(`${authPath}/sign-in`, {
    ...data,
    username: data.email,
  });
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

export const verifyUser = async (code: string): Promise<void> => {
  await apiClient.postJson(`${authPath}/verify/${code}`);
};

export const signOut = async (): Promise<void> => {
  await apiClient.postJson(`${userPath}/sign-out`, {});
};
