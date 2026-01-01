import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, MapPin, Tag, Package, ArrowLeft } from 'lucide-react'
import { Carousel } from '@/components/ui/carousel'

interface BusinessPageProps {
  params: {
    slug: string
  }
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      products: {
        orderBy: { createdAt: 'desc' },
      },
      offers: {
        where: {
          isActive: true,
          OR: [
            { expiryDate: null },
            { expiryDate: { gte: new Date() } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!business || business.status !== 'APPROVED') {
    notFound()
  }

  const mediaGallery = business.mediaGallery as string[] | null
  const images = mediaGallery && mediaGallery.length > 0 
    ? mediaGallery 
    : business.logoUrl 
    ? [business.logoUrl] 
    : []

  const getWhatsAppUrl = (productName?: string) => {
    const message = productName
      ? `Hello! I'm interested in ${productName} from ${business.name}.`
      : `Hello! I'm interested in learning more about ${business.name}.`
    return `https://wa.me/${business.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
  }

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
              <Link href="/listings" className="text-gray-700 hover:text-primary transition-colors font-medium">
                All Listings
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Categories
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/listings" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Link>

        {/* Business Header */}
        <Card className="mb-8 border-2 shadow-soft">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {business.logoUrl && (
                <div className="relative h-32 w-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={business.logoUrl}
                    alt={business.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{business.name}</h1>
                    <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
                      {business.category.icon} {business.category.name}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 text-lg mb-6">{business.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 mr-2" />
                    <span>{business.whatsappNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Gallery */}
        {images.length > 0 && (
          <Card className="mb-8 border-2 shadow-soft">
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Browse through our business images</CardDescription>
            </CardHeader>
            <CardContent>
              {images.length === 1 ? (
                <div className="relative h-96 w-full rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={images[0]}
                    alt={`${business.name} - Main image`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <Carousel images={images} alt={business.name} className="h-96" />
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Offers */}
        {business.offers.length > 0 && (
          <Card className="mb-8 border-2 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Daily Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {business.offers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4">
                    {offer.bannerUrl && (
                      <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                        <Image
                          src={offer.bannerUrl}
                          alt={offer.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                    {offer.discountDetails && (
                      <p className="text-gray-600 mb-2">{offer.discountDetails}</p>
                    )}
                    {offer.expiryDate && (
                      <p className="text-sm text-gray-500">
                        Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products */}
        {business.products.length > 0 && (
          <Card className="mb-8 border-2 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Products & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {business.products.map((product) => (
                  <Card key={product.id} className="overflow-hidden border-2 hover:border-primary/20 transition-all hover:shadow-md">
                    {product.imageUrl && (
                      <div className="relative h-48 w-full bg-gray-200">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
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
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </CardContent>
                    )}
                    <CardContent>
                      <a
                        href={getWhatsAppUrl(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full" variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact via WhatsApp
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Section */}
        <Card className="border-2 shadow-soft">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>Contact this business directly via WhatsApp</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                <Phone className="h-5 w-5 mr-2" />
                Contact via WhatsApp
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

