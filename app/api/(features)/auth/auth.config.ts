import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { AuthService } from "./auth.service";
import { loginSchema } from "./auth.validation";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/client/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const parsed = loginSchema.safeParse(credentials);

          if (!parsed.success) {
            return null;
          }

          const user = await AuthService.verifyCredentials(parsed.data);
          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.username = user.username;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token as { role?: string }).role ?? "staff";
        session.user.username = (token as { username?: string }).username ?? "";
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
