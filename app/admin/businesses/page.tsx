import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import Link from 'next/link'
import { DeleteBusinessButton } from '@/components/admin/DeleteBusinessButton'

export default async function AdminBusinessesPage() {
  await requireSuperAdmin()

  const businesses = await prisma.business.findMany({
    include: {
      user: {
        select: {
          email: true,
        },
      },
      category: true,
      _count: {
        select: {
          products: true,
          offers: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: businesses.length,
    pending: businesses.filter((b) => b.status === 'PENDING').length,
    approved: businesses.filter((b) => b.status === 'APPROVED').length,
    rejected: businesses.filter((b) => b.status === 'REJECTED').length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
        <p className="text-gray-600 mt-2">
          Review and manage all business listings
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Businesses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Businesses</CardTitle>
          <CardDescription>
            Click on a business to view details and manage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No businesses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Business Name</th>
                    <th className="text-left p-4 font-semibold">Category</th>
                    <th className="text-left p-4 font-semibold">Owner</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Products</th>
                    <th className="text-left p-4 font-semibold">Offers</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business) => (
                    <tr key={business.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-semibold">{business.name}</div>
                          <div className="text-sm text-gray-500">{business.slug}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {business.category.icon} {business.category.name}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {business.user.email}
                      </td>
                      <td className="p-4">
                        <Badge
                          className={
                            business.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : business.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {business.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{business._count.products}</td>
                      <td className="p-4 text-sm">{business._count.offers}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/business/${business.slug}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {business.status !== 'APPROVED' && (
                            <form action="/api/admin/businesses/approve" method="POST" className="inline">
                              <input type="hidden" name="businessId" value={business.id} />
                              <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </form>
                          )}
                          {business.status !== 'REJECTED' && (
                            <form action="/api/admin/businesses/reject" method="POST" className="inline">
                              <input type="hidden" name="businessId" value={business.id} />
                              <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </form>
                          )}
                          <DeleteBusinessButton businessId={business.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

