import { SectionCards } from '~/components/dashboard/section-cards';
import Loading from '~/components/ui/loading';
import useAuth from '~/contexts/auth/use-auth';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) {
    return <Loading />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
        </div>
      </div>
    </div>
  );
}
