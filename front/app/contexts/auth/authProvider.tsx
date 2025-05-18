import { useState } from "react";
import AuthContext from "./authContext";
import type { User } from "~/types/user";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    token: 'token',
    email: 'john.doe@example.com',
    profile: {
      code: '123456',
      name: 'John Doe',
    },
  } satisfies User);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
