import { db } from "../../db";
import { refreshTokens, users } from "../../db/schema";
import type { AuthModel } from "./model";
import { eq } from "drizzle-orm";
import { status } from "elysia";
import { SignJWT } from "jose";
import { createHash, randomBytes } from "crypto";

const REFRESH_TTL = 7 * 24 * 3600 * 1000;


export abstract class Auth{
    static async signUp(data: AuthModel["signUpBody"]){
        const exists = await db.select().from(users).where(eq(users.email, data.email));
        if (exists.length) throw status(409, "Email already used");

        const rows = await db.insert(users).values({
            email: data.email,
            password: data.password,
            name: data.name,
            age: data.age,
        })
    }

    static async issueAccess(userId: number) {
        const csrfToken = crypto.randomUUID();
        const token = await new SignJWT({ userId, csrf: csrfToken })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("15m")
            .sign(new TextEncoder().encode(Bun.env.JWT_SECRET));

        console.log("[DBG signIn] payload:", { userId, csrf: csrfToken });
        console.log("[DBG signIn] token parts:", token.split(".").length);

        return { token, csrfToken };
    }

    static async signIn({ email, password }: AuthModel["signInBody"]) {
        const rows = await db.select().from(users).where(eq(users.email, email));
        const user = rows[0];
        if (!user || user.password !== password)
            throw status(401, "email or password wrong") 

        const { token, csrfToken } = await Auth.issueAccess(user.id);
        return { token, csrfToken, userId: user.id };
    }

    static newRefresh() {
        const raw = randomBytes(32).toString("hex");
        const hash = createHash("sha256").update(raw).digest("hex");
        return { raw, hash };
    }

    static async saveRefresh(userId: number, hash: string) {
        await db.insert(refreshTokens).values({
            userId,
            hash,
            expiresAt: Date.now() + REFRESH_TTL,
        });
    }

    static async rotateRefresh(raw: string) {
        const hash = createHash("sha256").update(raw).digest("hex");
        const rows = await db.select().from(refreshTokens).where(eq(refreshTokens.hash, hash));
        const found = rows[0];
        if (!found || found.expiresAt < Date.now())
            throw status(401, "bad refresh");
        await db.delete(refreshTokens).where(eq(refreshTokens.hash, hash));
        return found.userId;
    }

    static async revokeRefresh(raw: string) {
        const hash = createHash("sha256").update(raw).digest("hex");
        await db.delete(refreshTokens).where(eq(refreshTokens.hash, hash));
    }

    static async findById(id: number) {
        const rows = await db.select().from(users).where(eq(users.id, id));
        return rows[0] ?? null;
    }

    static async updateMe(id: number, patch: AuthModel["updateBody"]) {
        if (Object.keys(patch).length === 0) return;
        if (patch.email) {
            const exists = await db.select().from(users).where(eq(users.email, patch.email));
            if (exists.length && exists[0].id !== id)
                throw status(409, "Email already used");
        }
        await db.update(users).set(patch).where(eq(users.id, id));
    }
}

type UserRow = typeof users.$inferSelect;

export const toProfile = (u: UserRow) => ({
    email: u.email,
    password: u.password,
    name: u.name,
    age: u.age,
});