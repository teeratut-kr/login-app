import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement : true}),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    age: integer("age").notNull(),
    /* sessionToken: text("session_token"), */
})

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  token: text("token").notNull().unique(),
});