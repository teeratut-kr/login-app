import { createFileRoute } from '@tanstack/react-router'
import { useSession } from "@better-auth-ui/react"
import { ShieldCheck } from "lucide-react"
import { UserButton } from "@/components/auth/user/user-button"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { data: session } = useSession(authClient)
  const isAdmin = (session?.user as { role?: string })?.role === "admin"
  return (
    <div className="p-8">
      <div className="flex justify-end">
        <UserButton
          links={isAdmin ? [{ label: "จัดการผู้ใช้", href: "/admin/users", icon: <ShieldCheck className="text-muted-foreground" />, visibility: "authenticated" }] : []}
        />
      </div>
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
