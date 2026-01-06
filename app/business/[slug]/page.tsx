import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, MapPin, Tag, Package, ArrowLeft, Star, Clock, CheckCircle, Globe, Facebook, Instagram, Twitter, Linkedin, ExternalLink, ChevronRight, Home } from 'lucide-react'
import { Carousel } from '@/components/ui/carousel'
import { ScrollHeader } from '@/components/ScrollHeader'
import { Footer } from '@/components/Footer'

interface BusinessPageProps {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

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

  const whatsappNumber = business.whatsapp || business.whatsappNumber || ''
  const socialLinks = business.socialLinks as { facebook?: string; instagram?: string; twitter?: string; linkedin?: string } | null

  const getWhatsAppUrl = (productName?: string) => {
    const message = productName
      ? `Hello! I'm interested in ${productName} from ${business.name}.`
      : `Hello! I'm interested in learning more about ${business.name}.`
    return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
  }

  const displayRating = business.rating || 4.8
  const reviewCount = 24 // This could be from a reviews table in the future

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Header */}
      <ScrollHeader />

      {/* Business Details Section - Above Banner */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/listings" className="hover:text-primary transition-colors">
              All Listings
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href={`/listings?category=${business.category.slug}`} className="hover:text-primary transition-colors">
              {business.category.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{business.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Business Name and Rating */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{business.name}</h1>
                {displayRating > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(displayRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900 ml-1 text-sm">{displayRating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({reviewCount})</span>
                  </div>
                )}
              </div>
              
              {/* Location and Status */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                {business.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{business.city}{business.address ? `, ${business.address}` : ''}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Closed - opens soon at 10:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Image Section - Container width, not full width */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <div className="relative">
            {images.length > 0 ? (
              <div className="relative h-[300px] md:h-[500px] w-full rounded-xl overflow-hidden">
                <Image
                  src={images[0]}
                  alt={business.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="h-[300px] md:h-[500px] w-full rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/30" />
            )}
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 lg:max-w-4xl">
            {/* Back Button */}
            <div className="mb-4">
              <Link
                href="/listings"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go back
              </Link>
            </div>

            {/* Description */}
            {business.description && (
              <section className="mb-8">
                <p className="text-base text-gray-700 leading-relaxed">{business.description}</p>
              </section>
            )}

            {/* Opening Hours - In Content Area */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Opening Hours</h2>
              <div className="space-y-2 text-sm">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">{day}</span>
                    <span className="text-gray-900 font-medium">10:00 AM - 11:30 PM</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery Section - Show all images */}
            {images.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-48 md:h-64 rounded-xl overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={image}
                        alt={`${business.name} - Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

        {/* Active Offers */}
        {business.offers.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Tag className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Special Offers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {business.offers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden border-2 hover:border-primary/30 transition-all hover:shadow-lg">
                  {offer.bannerUrl && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={offer.bannerUrl}
                        alt={offer.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{offer.title}</CardTitle>
                    {offer.discountDetails && (
                      <CardDescription className="text-base">{offer.discountDetails}</CardDescription>
                    )}
                  </CardHeader>
                  {offer.expiryDate && (
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Services Section - Fresha Style */}
        {business.products.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
            <div className="space-y-4">
              {business.products.map((product) => (
                <div
                  key={product.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Duration: 30 min
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        AED {product.price.toFixed(0)}
                      </span>
                      <a
                        href={getWhatsAppUrl(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Book
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

          </div>

          {/* Sidebar - Fresha Style */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Business Info and Contact Button */}
              <Card className="border-2 shadow-lg">
                <CardContent className="p-6">
                  {/* Business Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{business.name}</h2>
                  
                  {/* Rating */}
                  {displayRating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(displayRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{displayRating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">({reviewCount})</span>
                    </div>
                  )}
                  
                  {/* Location */}
                  {business.city && (
                    <div className="flex items-start gap-2 mb-4 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{business.city}{business.address ? `, ${business.address}` : ''}</span>
                    </div>
                  )}
                  
                  {/* Contact Button */}
                  <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="block">
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                      <Phone className="h-5 w-5 mr-2" />
                      Contact
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-2 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.address && (
                    <div>
                      <p className="text-gray-900 font-medium">{business.address}</p>
                      {business.city && (
                        <p className="text-gray-600 text-sm mt-1">{business.city}, UAE</p>
                      )}
                    </div>
                  )}
                  {business.geoLat && business.geoLng && (
                    <a
                      href={`https://www.google.com/maps?q=${business.geoLat},${business.geoLng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        Get directions
                      </Button>
                    </a>
                  )}
                  {!business.geoLat && business.address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address + (business.city ? `, ${business.city}` : ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        Get directions
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-2 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {whatsappNumber && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">WhatsApp</p>
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium text-sm"
                      >
                        {whatsappNumber}
                      </a>
                    </div>
                  )}
                  {business.phone && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <a
                        href={`tel:${business.phone}`}
                        className="text-gray-900 hover:text-primary font-medium text-sm"
                      >
                        {business.phone}
                      </a>
                    </div>
                  )}
                  {business.websiteUrl && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Website</p>
                      <a
                        href={business.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium text-sm flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {socialLinks && (socialLinks.facebook || socialLinks.instagram || socialLinks.twitter || socialLinks.linkedin) && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Social Media</p>
                      <div className="flex gap-3">
                        {socialLinks.facebook && (
                          <a
                            href={socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <Facebook className="h-5 w-5" />
                          </a>
                        )}
                        {socialLinks.instagram && (
                          <a
                            href={socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <Instagram className="h-5 w-5" />
                          </a>
                        )}
                        {socialLinks.twitter && (
                          <a
                            href={socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <Twitter className="h-5 w-5" />
                          </a>
                        )}
                        {socialLinks.linkedin && (
                          <a
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Share */}
              <Card className="border-2 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

