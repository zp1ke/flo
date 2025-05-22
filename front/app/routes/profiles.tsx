import PageContent from '~/components/layout/page-content';
import Loading from '~/components/ui/loading';
import useAuth from '~/contexts/auth/use-auth';

export default function Profiles() {
  const { user } = useAuth();
  if (!user) {
    return <Loading />;
  }

  return <PageContent title="PROFILES TODO" />;
}
