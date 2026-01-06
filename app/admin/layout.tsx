import { requireSuperAdmin } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Building2, Users, LogOut } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSuperAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Super Admin Dashboard</p>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                href="/admin"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </div>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                href="/admin/businesses"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4" />
                  <span>Business Management</span>
                </div>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                href="/admin/roles"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4" />
                  <span>Role Management</span>
                </div>
              </Button>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <form action="/api/auth/signout" method="post">
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}

