import { type FormEvent, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Link, useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { setToken } from '~/lib/auth';

export default function SignInForm() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const onSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setToken('test-token');
      navigate('/');
    }, 100);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your email below to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSignIn}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="mail@example.com" required disabled={processing} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required disabled={processing} autoComplete="signin-password" />
              </div>
              <Button type="submit" className="w-full" disabled={processing}>
                {processing && <Loader2 className="animate-spin" />}
                {processing && 'Signing in...'}
                {!processing && 'Sign in'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
