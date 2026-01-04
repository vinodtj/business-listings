'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  activePage?: 'home' | 'listings' | 'categories'
}

export function Header({ activePage }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            BusinessHub
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/listings"
              className={`transition-colors font-medium ${
                activePage === 'listings'
                  ? 'text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              All Listings
            </Link>
            <Link
              href="/categories"
              className={`transition-colors font-medium ${
                activePage === 'categories'
                  ? 'text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
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
  )
}

