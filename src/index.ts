import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { auth } from "./lib/auth";

new Elysia()
  .use(cors({ origin: true, credentials: true }))
  .use(openapi())
  .mount(auth.handler)
  .listen({ port: 3000, hostname: '0.0.0.0' });
console.log("Running at http://localhost:3000");
console.log("better-auth docs at http://localhost:3000/api/auth/reference");
