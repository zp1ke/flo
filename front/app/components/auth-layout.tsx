import type { ReactNode } from "react";
import { Outlet, redirect } from "react-router";
import AuthProvider from "~/contexts/auth/authProvider";
import { isAuth } from "~/services/auth";

export async function clientLoader() {
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve(undefined);
    }, 1000)
  );
  const hasAuth = await isAuth();
  if (!hasAuth) {
    throw redirect('/');
  }
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold mb-4">AUTH LAYOUT</div>
        <Outlet />
        <div className="mt-4">
          LOGOUT TODO
        </div>
      </div>
      {children}
    </AuthProvider>
  );
}
