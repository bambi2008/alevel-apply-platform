import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { verifyCode } from "@/lib/auth/phone-codes";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;
        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email ?? email, role: user.role };
      },
    }),
    Credentials({
      id: "phone",
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
      },
      authorize: async (creds) => {
        const phone = String(creds?.phone ?? "").trim();
        const code = String(creds?.code ?? "").trim();
        if (!/^1[3-9]\d{9}$/.test(phone) || !/^\d{6}$/.test(code)) return null;
        if (!(await verifyCode(phone, code))) return null;

        // 校验通过：已存在则登录，否则自动建号（含隐私同意记录）
        let user = await db.user.findUnique({ where: { phone } });
        if (!user) {
          user = await db.user.create({
            data: {
              phone,
              role: "STUDENT",
              consents: { create: [{ type: "PRIVACY_PIPL", version: "1.0" }] },
            },
          });
        }
        return { id: user.id, email: user.email ?? undefined, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        (token as Record<string, unknown>).uid = (user as { id?: string }).id;
        (token as Record<string, unknown>).role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.uid as string | undefined;
        (session.user as { role?: string }).role = token.role as string | undefined;
      }
      return session;
    },
  },
});
