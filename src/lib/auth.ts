import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "../db";
import { z } from "zod";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: { 
    enabled: true,
    minPasswordLength: 1,
  },
  user: {
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
