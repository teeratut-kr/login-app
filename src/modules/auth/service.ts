import { db } from "../../db";
import { users, sessions } from "../../db/schema";
import type { AuthModel } from "./model";
import { eq, and } from "drizzle-orm";
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
            /* sessionToken: null, */
        })
    }

    static async signIn({ email, password }: AuthModel["signInBody"]) {
        const rows = await db.select().from(users).where(and(eq(users.email, email ), eq(users.password, password )));
        /* console.log(rows); */
        /* console.log(rows[0]); */
        const user = rows[0];
        if (!user)
            throw status(401, "email or password wrong") 

        const token = crypto.randomUUID();
        /* await db.update(users).set({ sessionToken: token }).where(eq(users.id, user.id)); */
        await db.insert(sessions).values({ userId: user.id, token });
        return token;
    }

    static async findByToken(token: string) {
        /* const rows = await db.select().from(users).where(eq(users.sessionToken, token)); */
        const session = await db.select().from(sessions).where(eq(sessions.token, token));
        if (!session.length) return null;
        const rows = await db.select().from(users).where(eq(users.id, session[0].userId))
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