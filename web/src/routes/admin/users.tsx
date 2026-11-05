import { createFileRoute, Link } from "@tanstack/react-router"
import { Admin } from "@/components/auth/admin/admin"
import { UserButton } from "@/components/auth/user/user-button"

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <Link to="/settings/$path" params={{ path: "account" }}>กลับโปรไฟล์</Link>
        <UserButton />
      </div>
      <Admin view="users" />
    </div>
  )
}