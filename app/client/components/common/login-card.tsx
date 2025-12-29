"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginInput } from "@/app/api/(features)/auth/auth.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginCard() {
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
    <div className="w-full max-w-sm rounded-3xl border border-white/25 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-md">
      <h1 className="text-3xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-white/80">Masuk dengan username dan password Anda.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-white">Username</label>
          <Input
            placeholder="masukkan username"
            autoComplete="username"
            className="border-white/30 bg-black/40 text-white placeholder:text-white/50"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-sm text-red-200" role="alert">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-white">Password</label>
          <Input
            type="password"
            placeholder="********"
            autoComplete="current-password"
            className="border-white/30 bg-black/40 text-white placeholder:text-white/50"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-200" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {error ? (
          <div className="rounded-lg border border-red-300/60 bg-red-500/20 px-3 py-2 text-sm text-red-50">{error}</div>
        ) : null}

        <Button type="submit" className="w-full bg-black text-white hover:bg-black/90" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </div>
  );
}
