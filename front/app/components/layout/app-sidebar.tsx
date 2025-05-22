import {
  CircleDollarSignIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  UsersRoundIcon,
} from 'lucide-react';

import { NavMain } from '~/components/layout/nav-main';
import { NavUser } from '~/components/layout/nav-user';
import { ProfileSwitcher } from '~/components/layout/profile-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar';
import useAuth from '~/contexts/auth/use-auth';
import Loading from '~/components/ui/loading';
import type { ComponentProps } from 'react';

const data = {
  navMain: [
    {
      title: 'dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'profiles',
      url: '#',
      icon: UsersRoundIcon,
    },
    {
      title: 'transactions',
      url: '#',
      icon: CircleDollarSignIcon,
    },
    {
      title: 'settings',
      url: '#',
      icon: Settings2Icon,
    },
  ],
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  if (!user) {
    return <Loading />;
  }

  const activeProfileIndex = user.profiles.findIndex(
    (profile) => profile.code === user.activeProfile.code
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProfileSwitcher profiles={user.profiles} activeIndex={activeProfileIndex} />
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
