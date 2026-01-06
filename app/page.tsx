import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroSearch } from '@/components/HeroSearch'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    take: 8, // Show 8 featured categories
  })

  const totalBusinesses = await prisma.business.count({
    where: { status: 'APPROVED' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <Header activePage="home" />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/5 via-white to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover <span className="text-primary">Women-Owned Businesses</span> in the UAE
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              Find. Connect. Support
            </p>

            {/* Enhanced Search Bar */}
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-lg text-gray-600">Explore businesses organized by category</p>
          </div>
          <Link href="/categories">
            <Button variant="outline" className="mt-4 md:mt-0 border-2 hover:border-primary hover:text-primary transition-all">
              View All Categories
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/listings?category=${category.slug}`}>
              <Card className="group hover:shadow-hover transition-all duration-300 cursor-pointer h-full border-2 border-transparent hover:border-primary/20 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <CardTitle className="text-base md:text-lg font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-xs md:text-sm line-clamp-2">
                    {category.description?.substring(0, 60)}...
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{totalBusinesses}+</div>
              <div className="text-gray-600 font-medium">Verified Businesses</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{categories.length}+</div>
              <div className="text-gray-600 font-medium">Categories</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="bg-gradient-to-r from-primary to-primary/90 text-white py-16 md:py-20"
        style={{
          height: '450px'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">List Your Business</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of businesses already listed on our platform. Get discovered by customers in your area.
          </p>
          <Link href="/register-business">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all px-8">
              Register Your Business
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
