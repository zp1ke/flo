import { ChevronsUpDown, Loader2, LogOut, UserCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Avatar } from '~/components/ui/avatar';
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
import { Button } from '../ui/button';

export function NavUser() {
  const user = useUserStore((state) => state.user);
  const profile = useUserStore((state) => state.profile);
  const signOut = useUserStore((state) => state.signOut);

  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const [signingOut, setSigningOut] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                aria-label="user-menu"
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8">
                  <UserCircleIcon className="h-8 w-8" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {profile?.name}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive"
                  aria-label="sign-out"
                >
                  <LogOut />
                  {t('signOut.title')}
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent
            className={cn(
              'sm:max-w-[425px]',
              signingOut && '[&>button]:hidden',
            )}
            onInteractOutside={(e) => {
              if (signingOut) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>{t('signOut.confirmTitle')}</DialogTitle>
              <DialogDescription>
                {t('signOut.confirmMessage')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={signingOut}>
                  {t('signOut.cancel')}
                </Button>
              </DialogClose>
              <Button
                aria-label="sign-out-confirm"
                className="ml-auto flex"
                variant="destructive"
                disabled={signingOut}
                onClick={() => {
                  setSigningOut(true);
                  signOut().then(() => {
                    navigate('/');
                  });
                }}
              >
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
