import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroSearch } from '@/components/HeroSearch'

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

      {/* New Member Highlights Section */}
      <section className="min-h-screen bg-background py-16 px-4 overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-6xl relative h-[700px] md:h-[800px]">
          {/* Member Cards */}
          <div className="absolute" style={{ left: 'calc(12%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-6.26165px)' }}>
              <div className="w-20 h-20 md:w-24 md:h-24 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/member1-DKtZY21O.jpg" alt="Priya Sharma" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Priya Sharma</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Entrepreneur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(75%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-0.0772509px)' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/member2-B2MPxPL0.jpg" alt="Anita Desai" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Anita Desai</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Business Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(38%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-7.11906px)' }}>
              <div className="w-20 h-20 md:w-24 md:h-24 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/member3-D7XASURn.jpg" alt="Kavita Patel" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Kavita Patel</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Chef & Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(92%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-1.0193px)' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/brand1-BGugTgLS.jpg" alt="Crown Bakery" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Crown Bakery</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Artisan Bakery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(22%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-6.06087px)' }}>
              <div className="w-24 h-24 md:w-28 md:h-28 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/member4-9J5RTa-p.jpg" alt="Meera Singh" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Meera Singh</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Fashion Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(58%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-0.758027px)' }}>
              <div className="w-20 h-20 md:w-24 md:h-24 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/member5-B123aPcM.jpg" alt="Ritu Agarwal" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Ritu Agarwal</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Tech Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(5%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-7.90808px)' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/brand2-Bv3P4wg1.jpg" alt="Tasty Tadka" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Tasty Tadka</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Food Service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(85%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-5.76358px)' }}>
              <div className="w-20 h-20 md:w-24 md:h-24 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/member6-CWWJ3VCS.jpg" alt="Sunita Reddy" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Sunita Reddy</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Jewelry Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(45%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-7.47972px)' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/member1-DKtZY21O.jpg" alt="Neha Gupta" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Neha Gupta</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Consultant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(98%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-5.22724px)' }}>
              <div className="w-24 h-24 md:w-28 md:h-28 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/member2-B2MPxPL0.jpg" alt="Lakshmi Iyer" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Lakshmi Iyer</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute" style={{ left: 'calc(15%)', opacity: 1 }}>
            <div style={{ transform: 'translateY(-1.91366px)' }}>
              <div className="w-20 h-20 md:w-24 md:h-24 perspective-1000 cursor-pointer">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'none' }}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card ring-offset-2 ring-offset-background backface-hidden">
                    <img src="/assets/member3-D7XASURn.jpg" alt="Pooja Nair" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg ring-4 ring-primary/30 ring-offset-2 ring-offset-background backface-hidden flex flex-col items-center justify-center p-2 text-center" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-primary-foreground text-xs md:text-sm font-semibold leading-tight">Pooja Nair</p>
                    <p className="text-primary-foreground/80 text-[10px] md:text-xs mt-1">Cafe Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Centered Content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center justify-center text-center pointer-events-auto max-w-md px-4" style={{ opacity: 1, transform: 'none' }}>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                <span className="text-foreground">New Member </span>
                <span className="text-primary">Highlights</span>
              </h2>
              <h3 className="text-xl md:text-3xl font-bold mb-2">
                <span className="text-primary">Trusted by Leaders</span>
              </h3>
              <h4 className="text-lg md:text-2xl text-accent font-semibold mb-4">From Various Industries</h4>
              <p className="text-muted-foreground mb-8 text-sm md:text-base">
                Learn why professionals trust our solutions for end-to-end customer experience
              </p>
              <Link href="/register-business">
                <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  List your business
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
