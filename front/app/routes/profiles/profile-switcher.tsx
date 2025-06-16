import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  GalleryVerticalIcon,
  Plus,
  RefreshCwIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { ApiError } from '~/api/client';
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
  const profile = useUserStore((state) => state.profile);
  const profiles = useUserStore((state) => state.profiles);
  const setProfile = useUserStore((state) => state.setProfile);
  const loadProfiles = useUserStore((state) => state.loadProfiles);

  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onAddedProfile = async () => {
    setAddOpen(false);
  };

  const refreshProfiles = async () => {
    try {
      setProcessing(true);
      await loadProfiles(true);
    } catch (error) {
      toast.error(t('profiles.fetchError'), {
        description: t((error as ApiError).message),
        closeButton: true,
      });
    } finally {
      setProcessing(false);
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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{profile?.name}</span>
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
                  disabled={processing}
                >
                  <RefreshCwIcon />
                </Button>
              </DropdownMenuLabel>
              {profiles.map((item, index) => (
                <DropdownMenuItem
                  key={item.code}
                  onClick={() => setProfile(item)}
                  className="gap-2 p-2"
                  disabled={item.code === profile?.code}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <GalleryVerticalIcon className="size-4 shrink-0" />
                  </div>
                  {item.name}
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
          <DialogContent
            className={cn('sm:max-w-[425px]', processing && '[&>button]:hidden')}
            onInteractOutside={(e) => {
              if (processing) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>{t('profiles.add')}</DialogTitle>
              <DialogDescription>{t('profiles.editDescription')}</DialogDescription>
            </DialogHeader>
            <EditProfileForm
              onSaved={onAddedProfile}
              onProcessing={setProcessing}
              onCancel={() => setAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
