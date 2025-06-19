import { Loader2, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { ApiError } from '~/api/client';
import PageContent from '~/components/layout/page-content';
import { Button } from '~/components/ui/button';
import AddProfileButton from '~/routes/profiles/add-profile-button';
import useUserStore from '~/store/user-store';
import { ProfilesCards } from './profiles/profiles-cards';

export default function Profiles() {
  const { t } = useTranslation();

  const loading = useUserStore((state) => state.loading);
  const loadProfiles = useUserStore((state) => state.loadProfiles);

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
    <PageContent title={t('profiles.title')} subtitle={t('profiles.subtitle')}>
      <div className="flex justify-start items-center gap-2">
        <AddProfileButton />
        <Button
          variant="outline"
          size="icon"
          disabled={loading}
          onClick={refreshProfiles}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {!loading && <RefreshCwIcon className="h-4 w-4" />}
        </Button>
      </div>
      <ProfilesCards />
    </PageContent>
  );
}
