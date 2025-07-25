import {
  ChevronsUpDown,
  Plus,
  RefreshCwIcon,
  User2Icon,
  UserCheck2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { ApiError } from '~/api/client';
import AppLogo from '~/components/app-logo';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
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
import { cn } from '~/lib/utils';
import useUserStore from '~/store/user-store';
import { EditProfileForm } from './edit-profile-form';

export function ProfileSwitcher() {
  const loading = useUserStore((state) => state.loading);
  const profile = useUserStore((state) => state.profile);
  const profiles = useUserStore((state) => state.profiles);
  const setProfile = useUserStore((state) => state.setProfile);
  const loadProfiles = useUserStore((state) => state.loadProfiles);

  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const refreshProfiles = async () => {
    try {
      await loadProfiles(true);
    } catch (error) {
      toast.error(t('profiles.fetchError'), {
        description: t((error as ApiError).message),
        closeButton: true,
      });
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <AppLogo className="size-6" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {profile?.name}
                  </span>
                  <span className="truncate text-xs">{profile?.code}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground flex justify-between items-center">
                {t('profiles.title')}
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={refreshProfiles}
                  disabled={loading}
                >
                  <RefreshCwIcon />
                </Button>
              </DropdownMenuLabel>
              {profiles.map((item, index) => {
                const isActive = item.code === profile?.code;
                return (
                  <DropdownMenuItem
                    key={item.code}
                    onClick={() => setProfile(item)}
                    className="gap-2 p-2"
                    disabled={isActive}
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {isActive || <User2Icon className="size-4 shrink-0" />}
                      {isActive && (
                        <UserCheck2Icon className="size-4 shrink-0" />
                      )}
                    </div>
                    {item.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2" disabled={loading}>
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    {t('profiles.add')}
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent
            className={cn(
              'sm:max-w-[425px]',
              processing && '[&>button]:hidden',
            )}
            onInteractOutside={(e) => {
              if (processing) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>{t('profiles.add')}</DialogTitle>
              <DialogDescription>
                {t('profiles.editDescription')}
              </DialogDescription>
            </DialogHeader>
            <EditProfileForm
              onDone={(canceled: boolean) => {
                if (!canceled) {
                  refreshProfiles().then();
                }
                setAddOpen(false);
              }}
              onProcessing={setProcessing}
            />
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
