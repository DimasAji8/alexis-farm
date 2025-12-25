"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/app/api/(features)/auth/auth.validation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/client/dashboard";

  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setError(null);
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push(result?.url ?? callbackUrl);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-500/60">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div className="text-white md:max-w-md">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-200">Alexis Farm</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Kendalikan peternakan ayam Anda dengan data yang rapi.
          </h1>
          <p className="mt-4 text-lg text-slate-100/80">
            Masuk untuk melihat dashboard produksi telur, pakan, dan keuangan secara terpadu.
          </p>
          <div className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-amber-100">
            Gunakan akun admin seed: <span className="ml-2 font-semibold">admin / SEED_ADMIN_PASSWORD</span>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Masuk</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Selamat datang kembali</h2>
            <p className="text-sm text-slate-500">Masukkan username dan password Anda</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Username</label>
              <Input placeholder="admin" autoComplete="username" {...register("username")} />
              {errors.username && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                placeholder="********"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Masuk ke Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
