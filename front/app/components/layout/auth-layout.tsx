import { useEffect } from 'react';
import { Outlet, redirect, useNavigate } from 'react-router';
import { AppSidebar } from '~/components/layout/app-sidebar';
import { LanguageSelector } from '~/components/layout/language-selector';
import { ThemeModeSelector } from '~/components/layout/theme-mode-selector';
import { Separator } from '~/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import useUserStore from '~/store/user-store';
import GeneralBanner from './general-banner';

export async function clientLoader() {
  const user = useUserStore.getState().user;
  if (!user) {
    throw redirect('/');
  }
  await useUserStore.getState().fetchUser();
  await useUserStore.getState().loadProfiles();
}

export default function AuthLayout() {
  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <GeneralBanner />
          <div className="flex items-center gap-2 px-4">
            <LanguageSelector />
            <ThemeModeSelector />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
