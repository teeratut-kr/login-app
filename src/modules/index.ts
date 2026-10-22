import { Elysia } from "elysia";
import { auth } from "../lib/auth";

export const sessionGuard = new Elysia({ name: "session-guard" })
  .macro("isSignIn", {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({ headers });
      if (!session) return status(401, "Need login");
      return { user: session.user };
    },
  });
