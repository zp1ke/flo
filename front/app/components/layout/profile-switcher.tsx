import { ChevronsUpDown, GalleryVerticalEnd, GalleryVerticalIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import useAuth from '~/contexts/auth/use-auth';
import type { Profile } from '~/types/profile';

import { SaveProfileDialog } from '../form/save-profile-dialog';

export function ProfileSwitcher({
  activeIndex,
  profiles,
}: {
  activeIndex: number;
  profiles: Profile[];
}) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const { activateProfile } = useAuth();

  const [activeProfile, setActiveProfile] = useState(profiles[activeIndex]);
  const [profilesList, setProfilesList] = useState(profiles);
  const [processing, setProcessing] = useState(false);

  const setProfile = async (profile: Profile) => {
    setProcessing(true);
    await activateProfile(profile);
    setActiveProfile(profile);
    setProcessing(false);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SaveProfileDialog
          onSaved={(profile, setAsDefault) => {
            setProfilesList([...profilesList, profile]);
            if (setAsDefault) {
              setProfile(profile);
            }
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
                  onClick={() => setProfile(profile)}
                  className="gap-2 p-2"
                  disabled={processing || profile.code === activeProfile.code}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <GalleryVerticalIcon className="size-4 shrink-0" />
                  </div>
                  {profile.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2" disabled={processing}>
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">{t('profiles.add')}</div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </SaveProfileDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
