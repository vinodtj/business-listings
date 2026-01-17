import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Clock, CheckCircle, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await requireSuperAdmin()

  // Fetch dashboard statistics with error handling
  let totalListings = 0
  let pendingApprovals = 0
  let approvedListings = 0
  let rejectedListings = 0
  let hasConnectionError = false

  try {
    const [
      total,
      pending,
      approved,
      rejected,
    ] = await Promise.all([
      prisma.business.count().catch((err: any) => {
        if (err.message?.includes('database server') || err.message?.includes('Can\'t reach')) {
          hasConnectionError = true
        }
        return 0
      }),
      prisma.business.count({ where: { status: 'PENDING' } }).catch(() => 0),
      prisma.business.count({ where: { status: 'APPROVED' } }).catch(() => 0),
      prisma.business.count({ where: { status: 'REJECTED' } }).catch(() => 0),
    ])
    
    totalListings = total
    pendingApprovals = pending
    approvedListings = approved
    rejectedListings = rejected
  } catch (error: any) {
    console.error('Error fetching dashboard statistics:', error)
    if (error?.message?.includes('database server') || error?.message?.includes('Can\'t reach')) {
      hasConnectionError = true
    }
  }

  const stats = [
    {
      title: 'Total Listings',
      value: totalListings,
      description: 'All businesses in the system',
      icon: Building2,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      description: 'Awaiting review',
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Approved',
      value: approvedListings,
      description: 'Active listings',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Rejected',
      value: rejectedListings,
      description: 'Declined listings',
      icon: XCircle,
      color: 'text-red-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your business listing platform
        </p>
      </div>

      {hasConnectionError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <p className="font-semibold">⚠️ Database Connection Issue</p>
          <p className="text-sm mt-1">
            Unable to connect to the database. Please check:
          </p>
          <ul className="text-sm mt-2 ml-4 list-disc">
            <li>Your <code className="bg-yellow-100 px-1 rounded">DATABASE_URL</code> in the .env file</li>
            <li>Ensure your Supabase database is running (not paused)</li>
            <li>Use connection pooling (port 6543) for better reliability</li>
            <li>See <code className="bg-yellow-100 px-1 rounded">DATABASE_TROUBLESHOOTING.md</code> for detailed help</li>
          </ul>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/admin/businesses"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold">Review Pending Businesses</h3>
              <p className="text-sm text-gray-600 mt-1">
                Approve or reject business listings
              </p>
            </a>
            <a
              href="/admin/roles"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold">Manage User Roles</h3>
              <p className="text-sm text-gray-600 mt-1">
                Change user permissions and roles
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

