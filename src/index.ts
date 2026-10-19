import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { sessionGuard } from "./modules";

new Elysia()
  .use(cors({ origin: true, credentials: true }))
  .use(openapi())
  .use(sessionGuard)
  .listen({ port: 3000, hostname: '0.0.0.0' });
console.log("Running at http://localhost:3000");
