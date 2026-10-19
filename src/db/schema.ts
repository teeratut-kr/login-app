import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement : true}),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    age: integer("age").notNull(),
})

export const refreshTokens = sqliteTable("refresh_tokens", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull(),
    hash: text("hash").notNull().unique(),
    expiresAt: integer("expires_at").notNull(),
})
