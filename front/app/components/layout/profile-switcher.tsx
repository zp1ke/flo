import { ChevronsUpDown, GalleryVerticalEnd, GalleryVerticalIcon, Plus } from 'lucide-react';

import { DialogTrigger } from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';
import type { Profile } from '~/types/user';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AddProfileDialog } from '../form/add-profile-dialog';

export function ProfileSwitcher({
  activeIndex,
  profiles,
}: {
  activeIndex: number;
  profiles: Profile[];
}) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  const [activeProfile, setActiveProfile] = useState(profiles[activeIndex]);
  const [profilesList, setProfilesList] = useState(profiles);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AddProfileDialog
          onAdded={(profile) => {
            setProfilesList([...profilesList, profile]);
            setActiveProfile(profile);
          }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{activeProfile.name}</span>
                  <span className="truncate text-xs">{activeProfile.code}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t('profiles.title')}
              </DropdownMenuLabel>
              {profilesList.map((profile, index) => (
                <DropdownMenuItem
                  key={profile.code}
                  onClick={() => setActiveProfile(profile)}
                  className="gap-2 p-2"
                  disabled={profile.code === activeProfile.code}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <GalleryVerticalIcon className="size-4 shrink-0" />
                  </div>
                  {profile.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">{t('profiles.add')}</div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AddProfileDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
