import { redirect } from 'react-router';
import { GalleryVerticalEnd } from "lucide-react"

import { fetchUser } from '~/lib/auth';
import SignInForm from '~/components/sign-in-form';

export async function clientLoader() {
  const user = await fetchUser();
  if (user) {
    return redirect('/dashboard');
  }
}

export default function Home() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4"/>
            </div>
            Flo
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm/>
          </div>
        </div>
      </div>
    </div>
  );
}
