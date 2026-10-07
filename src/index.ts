import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { auth } from "./modules/auth";

new Elysia()
  .use(cors({ origin: true, credentials: true }))
  .use(openapi())
  .use(auth)
  .listen(3000);
  console.log("Running at http://localhost:3000");