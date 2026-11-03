import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { bearer, emailOTP, openAPI } from "better-auth/plugins";
import { db } from "../db";
import { sendMail } from "./email";
import { z } from "zod";
import { session as sessionTable } from "../db/schema";
import { eq } from "drizzle-orm";


export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  plugins: [
    openAPI(),
    bearer(),
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
