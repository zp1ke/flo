import Loading from '~/components/ui/loading';
import useAuth from '~/contexts/auth/use-auth';

export default function Profiles() {
  const { user } = useAuth();
  if (!user) {
    return <Loading />;
  }

  return (
    <div className="@container/main flex flex-1 flex-col space-y-4 p-8 pt-6 gap-2">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">PROFILES</h2>
      </div>
    </div>
  );
}
