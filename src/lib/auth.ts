import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { bearer, emailOTP, openAPI, admin } from "better-auth/plugins";
import type {
  LineIdTokenPayload,
  LineUserInfo,
} from "better-auth/social-providers";
import { db } from "../db";
import { sendMail } from "./email";
import { z } from "zod";
import { session as sessionTable } from "../db/schema";
import { eq } from "drizzle-orm";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:8080";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const LINE_CLIENT_ID = process.env.LINE_CLIENT_ID;
const LINE_CLIENT_SECRET = process.env.LINE_CLIENT_SECRET;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  onAPIError: {
    errorURL: `${FRONTEND_URL}/auth/error`,
  },
  socialProviders: {
    ...(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            disableSignUp: true,
          },
        }
      : {}),
    ...(FACEBOOK_CLIENT_ID && FACEBOOK_CLIENT_SECRET
      ? {
          facebook: {
            clientId: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
            disableSignUp: true,
          },
        }
      : {}),
    ...(LINE_CLIENT_ID && LINE_CLIENT_SECRET
      ? {
          line: {
            clientId: LINE_CLIENT_ID,
            clientSecret: LINE_CLIENT_SECRET,
            disableSignUp: true,
            // LINE channel has no EMAIL permission, so the provider never
            // returns an email. Use the LINE userId as a placeholder
            mapProfileToUser: (profile: LineUserInfo | LineIdTokenPayload) => ({
              name: profile.name ?? "LINE User",
              email: `${profile.sub}@line.user`,
              image: profile.picture,
              emailVerified: Boolean(profile.email),
            }),
          },
        }
      : {}),
  },
  plugins: [
    openAPI(),
    bearer(),
    admin({
      adminRoles: ["admin"], defaultRole: "user"
    }),
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[otp:${type}] ${email} -> ${otp}`);
        void sendMail(email, "รหัส OTP ยืนยันอีเมล", `รหัส OTP ของคุณคือ ${otp} (หมดอายุใน 5 นาที)`).catch((e) =>
          console.error("[mail:otp] failed", e),
        );
      },
    }),
  ],
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
  },
  databaseHooks: {
  session: {
    create: {
      before: async (newSession) => {
        await db.delete(sessionTable)
          .where(eq(sessionTable.userId, newSession.userId));
        },
      },
    },
  },
  emailAndPassword: { 
    enabled: true,
    minPasswordLength: 1,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(`[reset] ${user.email} -> ${url}`);
      void sendMail(user.email, "รีเซ็ตรหัสผ่าน", `กดลิงก์เพื่อรีเซ็ตรหัสผ่าน: ${url}`).catch((e) =>
        console.error("[mail:reset] failed", e),
      );
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["google", "facebook", "line"],
      allowDifferentEmails: true,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: false,
    },
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      age: { 
        type: "number", 
        required: true,
        validator: { input: z.number().min(0)}
    },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://192.168.0.234:3000",
    "http://192.168.0.234:8080",
  ],
});
