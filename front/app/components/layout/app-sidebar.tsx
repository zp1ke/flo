import * as React from 'react';
import { CircleDollarSignIcon, LayoutDashboardIcon, Settings2Icon } from 'lucide-react';

import { NavMain } from '~/components/layout/nav-main';
import { NavUser } from '~/components/layout/nav-user';
import { ProfileSwitcher } from '~/components/layout/profile-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '~/components/ui/sidebar';
import useAuth from '~/contexts/auth/use-auth';
import Loading from '~/components/ui/loading';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
      isActive: true,
    },
    {
      title: 'Transactions',
      url: '#',
      icon: CircleDollarSignIcon,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2Icon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  if (!user) {
    return <Loading />;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProfileSwitcher profiles={user.profiles} />
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
