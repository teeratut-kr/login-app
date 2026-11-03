import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { emailOtpPlugin } from "@better-auth-ui/core/plugins/email-otp";
import { authClient } from "@/lib/auth-client";
import { AuthProvider } from "./auth/auth-provider";

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <AuthProvider
      authClient={authClient}
      navigate={navigate}
      Link={({ href, ...props }) => <Link to={href} {...props} />}
      redirectTo="/settings/account"
      socialProviders={["google", "facebook", "line"]}
      emailAndPassword={{ requireEmailVerification: true }}
      additionalFields={[
        { name: "age", type: "number", label: "Age", min: 0, required: true, signUp: true },
      ]}
      plugins={[
        emailOtpPlugin({ emailVerification: true, signIn: false }),
      ]}
    >
      {children}
    </AuthProvider>
  );
}
