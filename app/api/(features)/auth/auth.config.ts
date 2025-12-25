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
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          throw new Error("Input tidak valid");
        }

        const user = await AuthService.verifyCredentials(parsed.data);

        return user;
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
  secret: process.env.AUTH_SECRET,
};
