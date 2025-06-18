import {
  BadgeInfoIcon,
  BoxIcon,
  DollarSignIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  UsersRoundIcon,
  WalletIcon,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import { NavMain } from '~/components/layout/nav-main';
import { NavUser } from '~/components/layout/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar';
import { ProfileSwitcher } from '~/routes/profiles/profile-switcher';

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
      icon: DollarSignIcon,
    },
    {
      title: 'categories',
      url: '/categories',
      icon: BoxIcon,
    },
    {
      title: 'wallets',
      url: '/wallets',
      icon: WalletIcon,
    },
    {
      title: 'settings',
      url: '/settings',
      icon: Settings2Icon,
    },
    {
      title: 'about',
      url: '/about',
      icon: BadgeInfoIcon,
    },
  ],
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProfileSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
