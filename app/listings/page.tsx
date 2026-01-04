import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Carousel } from '@/components/ui/carousel'
import { Footer } from '@/components/Footer'
import { ScrollableCategoryPills } from '@/components/ScrollableCategoryPills'
import { Header } from '@/components/Header'

interface ListingsPageProps {
  searchParams: { category?: string; search?: string }
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const categorySlug = searchParams.category
  const searchQuery = searchParams.search

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

  // Add search functionality
  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { category: { name: { contains: searchQuery, mode: 'insensitive' } } },
    ]
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
      {/* Header */}
      <Header activePage="listings" />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Enhanced Page Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : categorySlug
              ? categories.find((c) => c.slug === categorySlug)?.name || 'Business Listings'
              : 'All Business Listings'}
          </h1>
          {/* Horizontal Scrollable Category Pills */}
          <ScrollableCategoryPills categories={categories} activeCategorySlug={categorySlug} />

          {/* Filter Section */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">
                {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'} found
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Filter buttons can be added here in the future */}
              <button className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">
                Sort by
              </button>
              <button className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <main>

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

                  // Get the primary image to display
                  const primaryImage = images.length > 0 ? images[0] : null

                  return (
                    <Link key={business.id} href={`/business/${business.slug}`}>
                      <Card className="group hover:shadow-hover transition-all duration-300 cursor-pointer h-full overflow-hidden border-2 border-transparent hover:border-primary/20 hover:-translate-y-1">
                        {/* Business Image - Always show */}
                        <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {primaryImage ? (
                            <>
                              {images.length > 1 ? (
                                <Carousel images={images} alt={business.name} className="h-full" />
                              ) : (
                                <>
                                  <Image
                                    src={primaryImage}
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
                            </>
                          ) : (
                            // Placeholder when no image is available
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                              <div className="text-6xl mb-2">{business.category.icon || '🏢'}</div>
                              <div className="text-sm text-gray-500 font-medium">{business.category.name}</div>
                              {business.offers.length > 0 && (
                                <div className="absolute top-2 right-2 z-10">
                                  <Badge className="bg-red-500 text-white shadow-md">
                                    <Tag className="h-3 w-3 mr-1" />
                                    Daily Offer
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
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
                              <span>{business.whatsapp || business.whatsappNumber || 'N/A'}</span>
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

      {/* Footer */}
      <Footer />
    </div>
  )
}

