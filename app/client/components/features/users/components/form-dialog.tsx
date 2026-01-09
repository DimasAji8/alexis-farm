"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  username: z.string().min(3, "Minimal 3 karakter").max(50, "Maksimal 50 karakter").regex(/^[a-z0-9_.-]+$/, "Huruf kecil, angka, titik, garis bawah, atau minus"),
  name: z.string().min(3, "Minimal 3 karakter").max(100, "Maksimal 100 karakter"),
  role: z.enum(["super_user", "manager", "staff"]),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function UsersFormDialog({ open, onOpenChange, onSubmit, isLoading }: Props) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", name: "", role: "staff", isActive: true },
  });

  useEffect(() => {
    if (open) reset({ username: "", name: "", role: "staff", isActive: true });
  }, [reset, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
          <DialogDescription>Password default: alex1s</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
              <Input id="username" placeholder="username" className={errors.username ? "border-red-500" : ""} {...register("username")} />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nama <span className="text-red-500">*</span></Label>
              <Input id="name" placeholder="Nama lengkap" className={errors.name ? "border-red-500" : ""} {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Controller control={control} name="role" render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Pilih role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="super_user">Super User</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="isActive">Status</Label>
              <Controller control={control} name="isActive" render={({ field }) => (
                <Select onValueChange={(v) => field.onChange(v === "true")} value={field.value ? "true" : "false"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Batal</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Menyimpan..." : "Tambah"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
