import { Edit2Icon, TrashIcon, UserRoundCheckIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import useUserStore from '~/store/user-store';

export const ProfilesCards = () => {
  const activeProfile = useUserStore((state) => state.profile);
  const profiles = useUserStore((state) => state.profiles);

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card @container/card">
      {profiles.map((profile) => {
        const isActive = activeProfile?.code === profile.code;

        return (
          <Card className="@container/card" key={profile.code}>
            <CardHeader className="relative">
              <CardDescription>{profile.code}</CardDescription>
              <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold tabular-nums flex justify-start items-center">
                {profile.name}
              </CardTitle>
              {isActive && (
                <div className="absolute right-4 top-0">
                  <UserRoundCheckIcon />
                </div>
              )}
            </CardHeader>
            <CardFooter className="gap-2 flex justify-end items-center">
              <Button variant="outline" size="icon" disabled={isActive}>
                <UserRoundCheckIcon />
              </Button>
              <Button variant="outline" size="icon">
                <Edit2Icon />
              </Button>
              <Button variant="destructive" size="icon" disabled={isActive}>
                <TrashIcon />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
