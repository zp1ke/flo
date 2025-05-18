import type { Route } from "./+types/home";
import { isAuth } from "~/services/auth";
import { redirect } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Flo App" },
    { name: "description", content: "Welcome to Flo App!" },
  ];
}

export async function clientLoader() {
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve(undefined);
    }, 1000)
  );
  const hasAuth = await isAuth();
  if (hasAuth) {
    return redirect('/dashboard');
  }
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome, please login or signup</h1>
      <div className="mt-4 w-full max-w-md">
        TODO LOGIN
      </div>
    </div>
  );
}
