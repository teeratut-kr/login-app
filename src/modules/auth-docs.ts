import { Elysia } from "elysia";

export const authDocs = new Elysia({ name: "auth-docs" })
  .get("/auth-docs", () => new Response(
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Better Auth API</title>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/api/auth/open-api/generate-schema"
      data-title="Better Auth API"
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest"></script>
  </body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  ));
