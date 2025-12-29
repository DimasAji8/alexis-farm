"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

type Props = {
  children: React.ReactNode;
  session?: Session | null;
};

export function AuthProvider({ children, session }: Props) {
  return (
    <SessionProvider 
      session={session}
      // Hanya refetch setiap 5 menit, bukan setiap window focus
      refetchInterval={5 * 60}
      // Nonaktifkan refetch saat window focus untuk mengurangi API calls
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
