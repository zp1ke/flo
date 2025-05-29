import {
  CircleDollarSignIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  UsersRoundIcon,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import { NavMain } from '~/components/layout/nav-main';
import { NavUser } from '~/components/layout/nav-user';
import { ProfileSwitcher } from '~/components/profiles/profile-switcher';
import Loading from '~/components/ui/loading';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar';
import useAuth from '~/contexts/auth/use-auth';

const data = {
  navMain: [
    {
      title: 'dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'profiles',
      url: '/profiles',
      icon: UsersRoundIcon,
    },
    {
      title: 'transactions',
      url: '/transactions',
      icon: CircleDollarSignIcon,
    },
    {
      title: 'settings',
      url: '/settings',
      icon: Settings2Icon,
    },
  ],
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  if (!user) {
    return <Loading />;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProfileSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
