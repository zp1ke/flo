import { redirect, useNavigate } from 'react-router';
import { fetchUser, setToken } from '~/services/auth';

export async function clientLoader() {
  const user = await fetchUser();
  if (user) {
    return redirect('/dashboard');
  }
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome, please login or signup</h1>
      <div className="mt-4 w-full max-w-md">
        <button onClick={() => {
          setToken('test-token');
          navigate('/');
        }}>TODO LOGIN
        </button>
      </div>
    </div>
  );
}
