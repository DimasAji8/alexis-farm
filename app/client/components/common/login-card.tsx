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
    <div className="w-full max-w-sm rounded-3xl border bg-white p-8 shadow-2xl">
      <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
      <p className="mt-2 text-sm text-gray-600">Masuk dengan username dan password Anda.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <Input
            placeholder="masukkan username"
            autoComplete="username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-sm text-red-500" role="alert">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <Input
            type="password"
            placeholder="********"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {error ? (
          <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white hover:bg-black/90"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
