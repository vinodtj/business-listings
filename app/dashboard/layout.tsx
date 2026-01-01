import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Building2, LogOut, Package, Image as ImageIcon } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()
  
  // If user is not a business owner or admin, redirect to register business
  if (user.role !== 'BUSINESS_OWNER' && user.role !== 'SUPER_ADMIN') {
    redirect('/register-business')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Business Owner</p>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  href="/dashboard"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4" />
                    <span>My Businesses</span>
                  </div>
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/register-business">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  href="/register-business"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4" />
                    <span>Register Business</span>
                  </div>
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/products">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  href="/dashboard/products"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4" />
                    <span>My Products</span>
                  </div>
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/images">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  href="/dashboard/images"
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4" />
                    <span>Business Images</span>
                  </div>
                </Button>
              </Link>
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
      <main className="ml-64">
        {children}
      </main>
    </div>
  )
}

