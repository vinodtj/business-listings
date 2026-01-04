import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Building2, Package, Tag, Plus } from 'lucide-react'
import { redirect } from 'next/navigation'

interface DashboardPageProps {
  searchParams: { message?: string }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  let user
  try {
    user = await requireAuth()
  } catch (error) {
    // If user doesn't exist in database, redirect to sign in
    redirect('/auth/signin?error=Please sign in again')
  }
  
  // If user is not a business owner or admin, redirect to register business
  if (user.role !== 'BUSINESS_OWNER' && user.role !== 'SUPER_ADMIN') {
    redirect('/register-business')
  }
  
  const businesses = await prisma.business.findMany({
    where: { userId: user.id },
    include: {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
            <Link href="/register-business">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Register New Business
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {searchParams?.message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {searchParams.message === 'business-updated' 
              ? 'Business updated successfully! Your changes are pending admin approval.'
              : searchParams.message}
          </div>
        )}
        {businesses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Businesses Yet</h2>
              <p className="text-gray-600 mb-6">
                Get started by registering your first business
              </p>
              <Link href="/register-business">
                <Button size="lg">
                  Register Your Business
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Card key={business.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{business.name}</CardTitle>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          business.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800'
                            : business.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {business.status}
                        </span>
                      </div>
                    </div>
                    <CardDescription>{business.category.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2" />
                        {business._count.products} products
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag className="h-4 w-4 mr-2" />
                        {business._count.offers} offers
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link href={`/business/${business.slug}`}>
                        <Button variant="outline" className="w-full">
                          View Business
                        </Button>
                      </Link>
                      <Link href={`/dashboard/business/${business.id}/edit`}>
                        <Button variant="default" className="w-full">
                          Edit Business
                        </Button>
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href={`/dashboard/images?businessId=${business.id}`}>
                          <Button variant="ghost" size="sm" className="w-full text-xs">
                            📷 Images
                          </Button>
                        </Link>
                        <Link href={`/dashboard/products/new?businessId=${business.id}`}>
                          <Button variant="ghost" size="sm" className="w-full text-xs">
                            ➕ Product
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

