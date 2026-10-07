import { t, type UnwrapSchema } from "elysia";

const email = t.String({ format: "email"});
const password = t.String({ minLength: 1});
const name = t.String();
const age = t.Number({ minimum: 0 });

const userFields = t.Object({ email, password, name, age});


export const AuthModel = {
    signUpBody: userFields,
    signInBody: t.Pick(userFields,["email","password"]),
    updateBody: t.Partial(userFields),
    profile: userFields,
} as const;

export type AuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<typeof AuthModel[k]>;
};
// k in วนทำทุกkey 
// keyof รายชื่อ key ทั้งหมดเช่น signUpBody
// typeof AuthModel type ของ object AuthModel
// AuthModel[k] schema ของ key นั้นๆ 
// UnswrapSchema แกะ schema ออกมาเป็น type 