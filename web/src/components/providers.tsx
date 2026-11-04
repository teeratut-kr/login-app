import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { emailOtpPlugin } from "@/lib/auth/email-otp-plugin";
import { authClient } from "@/lib/auth-client";
import { AuthProvider } from "./auth/auth-provider";
import { adminPlugin } from "@/lib/auth/admin-plugin"

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <AuthProvider
      authClient={authClient}
      navigate={navigate}
      Link={({ href, ...props }) => <Link to={href} {...props} />}
      redirectTo="/settings/account"
      baseURL={window.location.origin}
      socialProviders={["google", "facebook", "line"]}
      emailAndPassword={{ requireEmailVerification: true }}
      multipleAccountsPerProvider={false}
      additionalFields={[
        { name: "age", type: "number", label: "Age", min: 0, required: true, signUp: true },
      ]}
      plugins={[
        adminPlugin(),
        emailOtpPlugin({ emailVerification: true, signIn: false }),
      ]}
    >
      {children}
    </AuthProvider>
  );
}
