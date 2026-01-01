import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, TrendingUp, Mail, Facebook, Instagram, Twitter, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollToTop } from '@/components/ScrollToTop'

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    take: 8, // Show 8 featured categories
  })

  const totalBusinesses = await prisma.business.count({
    where: { status: 'APPROVED' },
  })

  // Get popular categories for footer
  const popularCategories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          businesses: {
            where: { status: 'APPROVED' },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
    take: 12,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              BusinessHub
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/listings" className="text-gray-700 hover:text-primary transition-colors font-medium">
                All Listings
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Categories
              </Link>
              <Link href="/auth/signin" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Sign In
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                  Sign Up
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

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
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-white rounded-2xl shadow-soft border border-gray-200/50 p-2 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 pl-4">
                  <Search className="text-gray-400 h-5 w-5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search businesses, categories, or services..."
                    className="w-full py-3 focus:outline-none text-gray-700 placeholder:text-gray-400"
                  />
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 shadow-md hover:shadow-lg transition-all">
                  Search
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Popular: Restaurants, Shopping, Services
                </span>
              </div>
            </div>
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
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-16 md:py-20">
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
      <footer className="bg-slate-900 text-white relative">
        {/* Newsletter Section */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Subscribe to our newsletter</span>
              </div>
              <div className="flex items-center gap-4 flex-1 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6">
                  Subscribe
                </Button>
              </div>
              <div className="text-gray-300">
                Need help? <Link href="/contact" className="font-semibold hover:text-white transition-colors">Contact us</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            {/* Logo and Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">BusinessHub</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                Connecting you with reliable local businesses for all your service needs.
              </p>
              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <Facebook className="h-5 w-5 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <Instagram className="h-5 w-5 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <Twitter className="h-5 w-5 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <h4 className="font-semibold mb-4 text-white text-lg">Popular categories</h4>
              <ul className="space-y-2 text-gray-400">
                {popularCategories.slice(0, 12).map((category) => (
                  <li key={category.id}>
                    <Link href={`/listings?category=${category.slug}`} className="hover:text-white transition-colors">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4 text-white text-lg">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press & announcements
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers at BusinessHub
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of use
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Top Cities Section */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4 text-white text-lg">Top cities</h4>
            <div className="flex flex-wrap gap-2">
              {['New York', 'Chicago', 'Indianapolis', 'Boston', 'Atlanta', 'Cincinnati', 'Los Angeles', 'Dallas', 'Pittsburgh', 'Tampa'].map((city) => (
                <Link
                  key={city}
                  href={`/listings?city=${city.toLowerCase().replace(' ', '-')}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                © All rights reserved. Made by BusinessHub
              </p>
              {/* Payment Methods */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm mr-2">We accept:</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-semibold text-blue-600">VISA</div>
                  <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center text-xs font-semibold text-white">MC</div>
                  <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-xs font-semibold text-white">PP</div>
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-semibold text-gray-700">GP</div>
                  <div className="w-12 h-8 bg-black rounded flex items-center justify-center text-xs font-semibold text-white">AP</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Side Buttons */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
          <button className="w-12 h-20 bg-white shadow-lg rounded-l-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors group">
            <Settings className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-semibold text-gray-600 group-hover:text-primary transition-colors writing-vertical-rl">
              CUSTOMIZE
            </span>
          </button>
          <ScrollToTop />
        </div>
      </footer>
    </div>
  )
}
