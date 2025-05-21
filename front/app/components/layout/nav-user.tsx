import { ChevronsUpDown, Loader2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';
import type { User } from '~/types/user';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { signOut } from '~/lib/auth';

export function NavUser({ user }: { user: User }) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const userAvatar = '/user.svg';
  const profile = user.activeProfile;

  const [signingOut, setSigningOut] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userAvatar} alt=";)" />
                  <AvatarFallback className="rounded-lg">;)</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{profile.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userAvatar} alt=";)" />
                    <AvatarFallback className="rounded-lg">;)</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{profile.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <LogOut />
                  {t('signOut.title')}
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent
            className="[&>button]:hidden"
            onInteractOutside={(e) => {
              if (signingOut) {
                e.preventDefault();
              }
            }}>
            <DialogHeader>
              <DialogTitle>{t('signOut.confirmTitle')}</DialogTitle>
              <DialogDescription>{t('signOut.confirmMessage')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={signingOut}>
                  {t('signOut.cancel')}
                </Button>
              </DialogClose>
              <Button
                className="ml-auto flex"
                variant="destructive"
                disabled={signingOut}
                onClick={() => {
                  setSigningOut(true);
                  signOut().then(() => {
                    navigate('/');
                  });
                }}>
                {signingOut && <Loader2 className="animate-spin" />}
                {signingOut && t('signOut.processing')}
                {!signingOut && t('signOut.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
