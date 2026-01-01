import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import Link from 'next/link'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { redirect } from 'next/navigation'

export default async function ProductsPage() {
  const user = await requireAuth()
  
  // If user is not a business owner or admin, redirect to register business
  if (user.role !== 'BUSINESS_OWNER' && user.role !== 'SUPER_ADMIN') {
    redirect('/register-business')
  }

  const businesses = await prisma.business.findMany({
    where: { userId: user.id },
    include: {
      products: {
        orderBy: { createdAt: 'desc' },
      },
      category: true,
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-2">
            Manage products and services for your businesses
          </p>
        </div>
        {businesses.length > 0 && (
          <Link href="/dashboard/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        )}
      </div>

      {businesses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Businesses Found</h2>
            <p className="text-gray-600 mb-6">
              You need to register a business first before adding products
            </p>
            <Link href="/register-business">
              <Button size="lg">Register Your Business</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {businesses.map((business) => (
            <Card key={business.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{business.name}</CardTitle>
                    <CardDescription>
                      {business.category.icon} {business.category.name}
                    </CardDescription>
                  </div>
                  <Link href={`/dashboard/products/new?businessId=${business.id}`}>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {business.products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No products yet. Add your first product!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {business.products.map((product) => (
                      <Card key={product.id} className="relative">
                        {product.imageUrl && (
                          <div className="relative h-48 w-full bg-gray-200 rounded-t-lg overflow-hidden">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription className="text-lg font-semibold text-gray-900">
                            ${product.price.toFixed(2)}
                          </CardDescription>
                        </CardHeader>
                        {product.description && (
                          <CardContent>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {product.description}
                            </p>
                          </CardContent>
                        )}
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/products/${product.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <DeleteProductButton productId={product.id} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

