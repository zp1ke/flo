import * as React from 'react';
import { ChevronsUpDown, GalleryVerticalEnd, GalleryVerticalIcon, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '~/components/ui/sidebar';
import type { Profile } from '~/types/user';

export function ProfileSwitcher({
                                  profiles,
                                }: {
  profiles: Profile[];
}) {
  const { isMobile } = useSidebar();
  const [activeProfile, setActiveProfile] = React.useState(profiles[0]);

  if (!activeProfile) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4"/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeProfile.name}</span>
                <span className="truncate text-xs">{activeProfile.code}</span>
              </div>
              <ChevronsUpDown className="ml-auto"/>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">Profiles</DropdownMenuLabel>
            {profiles.map((profile, index) => (
              <DropdownMenuItem key={profile.code} onClick={() => setActiveProfile(profile)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <GalleryVerticalIcon className="size-4 shrink-0"/>
                </div>
                {profile.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4"/>
              </div>
              <div className="font-medium text-muted-foreground">Add profile</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
