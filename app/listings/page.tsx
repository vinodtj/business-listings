import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Carousel } from '@/components/ui/carousel'

interface ListingsPageProps {
  searchParams: { category?: string }
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const categorySlug = searchParams.category

  const whereClause: any = {
    status: 'APPROVED',
  }

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    })
    if (category) {
      whereClause.categoryId = category.id
    }
  }

  const businesses = await prisma.business.findMany({
    where: whereClause,
    include: {
      category: true,
      offers: {
        where: {
          isActive: true,
          OR: [
            { expiryDate: null },
            { expiryDate: { gte: new Date() } },
          ],
        },
        take: 1,
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              BusinessHub
            </Link>
            <nav className="hidden md:flex gap-8">
              <Link href="/listings" className="text-primary font-semibold">
                All Listings
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Categories
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Enhanced Page Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {categorySlug
              ? categories.find((c) => c.slug === categorySlug)?.name || 'Business Listings'
              : 'All Business Listings'}
          </h1>
          <p className="text-gray-600 text-lg">
            {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-24 border-2 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Filter by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Link
                    href="/listings"
                    className={`block px-4 py-3 rounded-lg transition-all ${
                      !categorySlug
                        ? 'bg-primary/10 text-primary font-semibold border-2 border-primary/20'
                        : 'hover:bg-gray-50 text-gray-700 border-2 border-transparent'
                    }`}
                  >
                    All Categories
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/listings?category=${category.slug}`}
                      className={`block px-4 py-3 rounded-lg transition-all ${
                        categorySlug === category.slug
                          ? 'bg-primary/10 text-primary font-semibold border-2 border-primary/20'
                          : 'hover:bg-gray-50 text-gray-700 border-2 border-transparent'
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Enhanced Main Content */}
          <main className="flex-1">

            {businesses.length === 0 ? (
              <Card className="border-2 shadow-soft">
                <CardContent className="py-16 text-center">
                  <p className="text-gray-500 text-lg">
                    No businesses found in this category yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => {
                  const mediaGallery = business.mediaGallery as string[] | null
                  const images = mediaGallery && mediaGallery.length > 0 
                    ? mediaGallery 
                    : business.logoUrl 
                    ? [business.logoUrl] 
                    : []

                  return (
                    <Link key={business.id} href={`/business/${business.slug}`}>
                      <Card className="group hover:shadow-hover transition-all duration-300 cursor-pointer h-full overflow-hidden border-2 border-transparent hover:border-primary/20 hover:-translate-y-1">
                        {images.length > 0 && (
                          <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                            {images.length > 1 ? (
                              <Carousel images={images} alt={business.name} className="h-full" />
                            ) : (
                              <>
                                <Image
                                  src={images[0]}
                                  alt={business.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {business.offers.length > 0 && (
                                  <div className="absolute top-2 right-2 z-10">
                                    <Badge className="bg-red-500 text-white shadow-md">
                                      <Tag className="h-3 w-3 mr-1" />
                                      Daily Offer
                                    </Badge>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{business.name}</CardTitle>
                              <Badge variant="outline" className="mb-2 border-primary/20 text-primary">
                                {business.category.name}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {business.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-primary" />
                              <span>{business.whatsappNumber}</span>
                            </div>
                            {business._count.products > 0 && (
                              <div className="text-gray-500">
                                {business._count.products} {business._count.products === 1 ? 'product' : 'products'}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

