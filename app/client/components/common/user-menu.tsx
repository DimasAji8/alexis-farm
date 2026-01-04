"use client";

import * as React from "react";
import { ChevronDown, LogOut, KeyRound } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { cn } from "@/app/client/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";

type UserMenuProps = {
  userName: string;
  userRole: string;
  initials: string;
};

const formatRole = (role: string) =>
  role
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");

export function UserMenu({
  userName,
  userRole,
  initials,
}: UserMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }
    setIsLoading(true);
    try {
      await apiClient("/api/users/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      toast.success("Password berhasil diubah");
      setPasswordOpen(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg bg-muted/40 px-3 py-3 text-left transition-colors hover:bg-muted/60 h-auto",
              "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
              {initials}
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-foreground">
                {userName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {formatRole(userRole)}
              </p>
            </div>
            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="w-56">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {userName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {formatRole(userRole)}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setOpen(false);
              setPasswordOpen(true);
            }}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Ubah Password
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setOpen(false);
              setConfirmOpen(true);
            }}
            className="text-red-600 dark:text-red-400 focus:bg-red-100 focus:text-red-700 dark:focus:bg-red-900/50 dark:focus:text-red-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
            <DialogDescription>Masukkan password lama dan password baru Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="oldPassword">Password Lama</Label>
              <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)} disabled={isLoading}>Batal</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Menyimpan..." : "Simpan"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Keluar dari sistem?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin keluar dari aplikasi?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                void signOut();
              }}
            >
              Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
