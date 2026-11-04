import { createFileRoute, Link } from "@tanstack/react-router"
import { Admin } from "@/components/auth/admin/admin"
import { UserButton } from "@/components/auth/user/user-button"

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  return (
    <div>
      <div> {/* แถบบน */}
        <Link to="/settings/$path" params={{ path: "account" }}>กลับโปรไฟล์</Link>
        <UserButton />
      </div>
      <Admin view="users" />
    </div>
  )
}