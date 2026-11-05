# login-app

ระบบ login ด้วย **Elysia (Bun)** + **better-auth** (email/OTP, social login Google/LINE/Facebook, admin) และหน้าเว็บ **TanStack Router + better-auth-ui** (port 8080)

## Stack

- Backend: Bun + Elysia + better-auth + Drizzle ORM + SQLite (`src/`)
- Frontend: TanStack Router + Vite + better-auth-ui (`web/`, port 8080)
- OTP ส่งผ่าน Gmail SMTP (Nodemailer)

## เริ่มใช้งาน

```bash
# 1. เตรียม env (ห้าม commit .env ไฟล์จริง)
cp .env.example .env
# ใส่ค่า: JWT_SECRET, BETTER_AUTH_SECRET, GMAIL_USER, GMAIL_APP_PASSWORD,
# GOOGLE/LINE/FACEBOOK CLIENT_ID/SECRET (ถ้าใช้ social login)

# 2. ติดตั้ง + เตรียม DB
bun install
bun run db:push

# 3. รัน backend (http://localhost:3000, docs: /api/auth/reference)
bun run dev

# 4. รัน frontend (http://localhost:8080) — เปิดอีก terminal
cd web && bun install && bun run dev
```

Callback ที่ต้องลงทะเบียนกับ provider (ถ้าใช้ social login):

- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/facebook`
- `http://localhost:3000/api/auth/callback/line`

## แผนที่ branch (อ่านตามลำดับการพัฒนา)

`master` คือโค้ดรวมล่าสุด ส่วน branch ย่อยเก็บงานไว้เป็นขั้น ๆ กด checkout ไล่ดูได้:

| ลำดับ | Branch | งานในขั้น |
|---|---|---|
| base | `baseDevLogin` | จุดตั้งต้น (= master ก่อนรวมงาน) |
| 1 | `cookieMultiLogin` | cookie + multi-login |
| 2 | `jwt-cookie` | JWT เก็บใน cookie (jose) |
| 3 | `refreshToken` | refresh token (+ Cloudflare tunnel) |
| 4 | `better-AuthLogin` | ย้ายมา better-auth |
| 5 | `OTP-magicLink-setServerEmail` | OTP / magic link / ตั้งค่า SMTP |
| 6 | `autoSendVerificationEmail` | ส่ง verification email อัตโนมัติ |
| 7 | `socialLink-Backend` | ผูก provider Google/LINE/Facebook |
| 8 | `socialLink-Frontend` | หน้าเว็บ TanStack + better-auth-ui |
| 9 | `adminPanel` | ระบบ admin (plugin, ban, หน้าจัดการ users) |
| แยก | `headersToken` | variant: ส่ง token ผ่าน headers แทน cookie (ไม่รวมสายหลัก) |

ปลายสาย `adminPanel` มีงานครบทุกขั้นแล้ว merge เข้า `master` แล้ว

## หมายเหตุ

- `node_modules/`, `web/dist`, `web/.tanstack` เป็นของที่ gen ใหม่ได้ ถูก ignore ไว้ ลบได้ (`bun install` / build ใหม่)
- `.env` ไฟล์จริงห้าม commit — ใช้ `.env.example` เป็นต้นแบบ
