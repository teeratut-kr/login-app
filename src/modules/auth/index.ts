import { Elysia, t } from "elysia";
import { Auth, toProfile } from "./service";
import { AuthModel } from "./model";
import { jwtVerify } from "jose";


export const auth = new Elysia()
    .macro("isSignIn", {
        async resolve({ cookie, headers, status}) {
            const token = cookie.session?.value;
            if (typeof token !== "string" || !token) 
            return status(401, "No Token");

            let payload: any;
            try {
                const key = new TextEncoder().encode(Bun.env.JWT_SECRET);
                 ({ payload }  = await jwtVerify(token, key));
            }catch {
                return status(401, "Need Token");
            }
            
            console.log("[DBG resolve] cookie?", !!token, "| csrf header:", headers["x-csrf-token"]);
            
            if (typeof payload.userId !== "number" || headers['x-csrf-token'] !== payload.csrf)
                return status(401, "Need login");

            console.log("[DBG resolve] payload:", payload);

            const user = await Auth.findById(payload.userId);
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

    .post("/sign-in", async ({ body, cookie, status }) => {
        const { token , csrfToken } = await Auth.signIn(body);
        cookie.session.value = token;
        cookie.session.set({
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/'
        });
        console.log("[DBG sign-in] body csrf:", csrfToken);
        return status(200, {csrfToken}) ;
    }, {
        body: AuthModel.signInBody
    })

    .get("/me", ({ user }) => toProfile(user),
    {
        isSignIn: true,
        headers: t.Object({ 'x-csrf-token': t.String() })
    })

    .patch("/me", async ({ user, body, status}) => {
        await Auth.updateMe(user.id, body);
        return status(200, "Updated");
    }, { 
        isSignIn: true, 
        body: AuthModel.updateBody,
        headers: t.Object({ 'x-csrf-token': t.String() })
    })
