import { viewPaths } from "@better-auth-ui/core"
import { createFileRoute, redirect } from "@tanstack/react-router"

import { Auth } from "@/components/auth/auth"
import { emailOtpPlugin } from "@better-auth-ui/core/plugins/email-otp";

const validAuthPathSegments = new Set([
  ...Object.values(viewPaths.auth),
  emailOtpPlugin().viewPaths.auth.emailOtp
])

export const Route = createFileRoute("/auth/$path")({
  beforeLoad({ params: { path } }) {
    if (!validAuthPathSegments.has(path)) {
      throw redirect({ to: "/" })
    }
  },
  component: AuthPage
})

function AuthPage() {
  const { path } = Route.useParams()

  return (
    <div className="flex justify-center my-auto p-4 md:p-6">
      <Auth path={path} />
    </div>
  )
}