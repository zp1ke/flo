import { Outlet, redirect } from 'react-router';
import { AppSidebar } from '~/components/layout/app-sidebar';
import { LanguageSelector } from '~/components/layout/language-selector';
import { ThemeModeSelector } from '~/components/layout/theme-mode-selector';
import { Separator } from '~/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import AuthProvider from '~/contexts/auth/auth-provider';
import { fetchUser } from '~/lib/auth';

export async function clientLoader() {
  const user = await fetchUser();
  if (!user) {
    throw redirect('/');
  }
}

export default function AuthLayout() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="flex items-center gap-2 px-4">
              <LanguageSelector />
              <ThemeModeSelector />
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
