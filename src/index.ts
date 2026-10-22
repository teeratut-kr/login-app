import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { auth } from "./lib/auth";
import { sessionGuard } from "./modules";
import { authDocs } from "./modules/auth-docs";

new Elysia()
  .use(cors({ origin: true, credentials: true }))
  .use(openapi())
  .mount(auth.handler)
  .use(sessionGuard)
  .use(authDocs)
  .listen({ port: 3000, hostname: '0.0.0.0' });
console.log("Running at http://localhost:3000");
