import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { openAPI } from "better-auth/plugins";
import { db } from "../db";
import { z } from "zod";
import { session as sessionTable } from "../db/schema";
import { eq } from "drizzle-orm";


export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  plugins: [openAPI()],
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
