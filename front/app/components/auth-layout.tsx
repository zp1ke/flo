import type { ReactNode } from 'react';
import { Outlet, redirect, useNavigate } from 'react-router';
import AuthProvider from '~/contexts/auth/auth-provider';
import { fetchUser, setToken } from '~/lib/auth';

export async function clientLoader() {
  const user = await fetchUser();
  if (!user) {
    throw redirect('/');
  }
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <AuthProvider>
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className='text-2xl font-bold mb-4'>AUTH LAYOUT</div>
        <Outlet/>
        <div className='mt-4'>
          <button onClick={() => {
            setToken(null);
            navigate('/');
          }}>LOGOUT TODO
          </button>
        </div>
      </div>
      {children}
    </AuthProvider>
  );
}
