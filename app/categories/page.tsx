import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          businesses: {
            where: {
              status: 'APPROVED',
            },
          },
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <Header activePage="categories" />

      {/* Enhanced Page Header */}
      <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">All Categories</h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Browse businesses by category. Find exactly what you're looking for.
          </p>
        </div>
      </div>

      {/* Enhanced Categories Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/listings?category=${category.slug}`}>
              <Card className="group hover:shadow-hover transition-all duration-300 cursor-pointer h-full border-2 border-transparent hover:border-primary/20 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                      <Building2 className="h-4 w-4" />
                      <span>{category._count.businesses} businesses</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {category.description || 'Explore businesses in this category'}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-primary font-semibold group-hover:underline inline-flex items-center gap-1">
                      View Listings →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

