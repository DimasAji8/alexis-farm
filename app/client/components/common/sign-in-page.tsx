"use client";

import { useState, startTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";

import { loginSchema, type LoginInput } from "@/app/api/(features)/auth/auth.validation";
import { Button } from "@/app/client/components/ui/button";

export function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/client/dashboard";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
        callbackUrl,
      });
      
      if (result?.error) {
        // NextAuth returns "CredentialsSignin" for invalid credentials
        if (result.error === "CredentialsSignin") {
          toast.error("Username atau password salah");
        } else {
          toast.error(result.error);
        }
        return;
      }
      
      if (result?.ok) {
        toast.success("Login berhasil! Mengalihkan ke dashboard...");
        // Redirect dengan startTransition untuk menghindari error
        startTransition(() => {
          router.push(callbackUrl);
          router.refresh();
        });
      }
    } catch (err) {
      toast.error("Gagal melakukan login, silakan coba lagi");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Left Panel - Form Section (30% on desktop, full width on mobile) */}
      <div className="w-full md:w-[30%] flex items-center justify-center bg-white px-6 py-8 md:px-8 md:py-12">
        <div className="w-full max-w-sm">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Image
                src="/images/avisa-login.webp"
                alt="Alexis Farm Logo"
                width={260}
                height={90}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
            <p className="text-sm text-gray-500">Masuk dengan username dan password Anda.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                placeholder="masukkan username"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-red-600 mt-1.5" role="alert">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="********"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1.5" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-black text-white hover:bg-black/90"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              © 2025 Alexis Farm. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Image Section (70% on desktop, hidden on mobile) */}
      <div className="hidden md:block md:w-[70%] relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/login.webp"
            alt="Alexis Farm"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="relative h-full flex flex-col justify-between p-8 lg:p-12">
          {/* Top brand */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold">Alexis Farm</p>
          </div>

          {/* Center content */}
          <div className="space-y-4 lg:space-y-6 text-white max-w-2xl">
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight">
              Pantau Kandang<br />Lebih Mudah.
            </h1>
            <p className="text-base lg:text-lg text-white/90 leading-relaxed max-w-xl">
              Awasi ayam, pakan, dan produksi telur dalam satu dashboard terpadu. Masuk untuk mulai mengelola 
              operasional peternakan dengan rapi dan efisien.
            </p>
            
            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 lg:gap-3 pt-4">
              <div className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-xs lg:text-sm font-medium">Real-time Monitoring</span>
              </div>
              <div className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-xs lg:text-sm font-medium"> Easy Management</span>
              </div>
              <div className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-xs lg:text-sm font-medium"> Egg Production Tracking</span>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-4 lg:gap-8 max-w-2xl">
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-xs lg:text-sm text-white/70">Kandang Terdaftar</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-xs lg:text-sm text-white/70">Uptime System</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-xs lg:text-sm text-white/70">Monitoring Aktif</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
