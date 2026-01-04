import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Mail, Facebook, Instagram, Twitter, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollToTop } from '@/components/ScrollToTop'

export async function Footer() {
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
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
            {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'].map((city) => (
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
  )
}

