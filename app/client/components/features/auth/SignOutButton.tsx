"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button variant="ghost" onClick={() => signOut()} className="h-10 px-3 text-sm">
      Keluar
    </Button>
  );
}
