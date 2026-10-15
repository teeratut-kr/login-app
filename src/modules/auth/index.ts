import { Elysia } from "elysia";
import { Auth, toProfile } from "./service";
import { AuthModel } from "./model";


export const auth = new Elysia()
    .macro("isSignIn", {
        async resolve({ headers, status}) {
            /* const token = cookie.session?.value; */
            const raw = headers.authorization;
            /* console.log(headers); */
            const token = raw?.replace(/^Bearer\s+/i, "")?.trim();
            /* console.log(token); */
            if (typeof token !== "string" || !token) 
            return status(401, "No token");

            const user = await Auth.findByToken(token);
            if (!user) return status(401, "Need login");
            return { user };
        }
    })

    .post("/sign-up", async ({ body, status }) => {
        await Auth.signUp(body);
        return status(201, "Created");
    }, { 
        body: AuthModel.signUpBody 
    })

    .post("/sign-in", async ({ body, status }) => {
        const token = await Auth.signIn(body);
       /*  cookie.session.value = token;
        cookie.session.set({
        sameSite: 'none',
        secure: true,
        path: '/'
        }); */
        return status(200, {'token': token});
    }, {
        body: AuthModel.signInBody
    })

    .get("/me", ({ user }) => toProfile(user),
    { isSignIn: true })

    .patch("/me", async ({ user, body, status}) => {
        await Auth.updateMe(user.id, body);
        return status(200, "Updated");
    }, { 
        isSignIn: true, 
        body: AuthModel.updateBody
    })

