import { db } from "../../db";
import { users } from "../../db/schema";
import type { AuthModel } from "./model";
import { eq } from "drizzle-orm";
import { status } from "elysia";


export abstract class Auth{
    static async signUp(data: AuthModel["signUpBody"]){
        const exists = await db.select().from(users).where(eq(users.email, data.email));
        if (exists.length) throw status(409, "Email already used");

        const rows = await db.insert(users).values({
            email: data.email,
            password: data.password,
            name: data.name,
            age: data.age,
            sessionToken: null,
        }).returning();

        return rows[0];
    }

    static async signIn({ email, password }: AuthModel["signInBody"]) {
        const rows = await db.select().from(users).where(eq(users.email, email));
        const user = rows[0];
        if (!user || user.password !== password)
            throw status(401, "email or password wrong") 

        const token = crypto.randomUUID();
        await db.update(users).set({ sessionToken: token }).where(eq(users.id, user.id));
        return { user, token };
    }

    static async findByToken(token: string) {
        const rows = await db.select().from(users).where(eq(users.sessionToken, token));
        return rows[0] ?? null;
    }

    static async updateMe(id: number, patch: AuthModel["updateBody"]) {
        const rows = await db.update(users).set(patch).where(eq(users.id, id))
        .returning();
        return rows[0];
    }
}
