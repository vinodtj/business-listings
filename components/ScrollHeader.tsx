'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ScrollHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`text-2xl font-bold transition-colors ${
              isScrolled
                ? 'bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'
                : 'text-white'
            }`}
          >
            BusinessHub
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link
              href="/listings"
              className={`transition-colors font-medium ${
                isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
              }`}
            >
              All Listings
            </Link>
            <Link
              href="/categories"
              className={`transition-colors font-medium ${
                isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
              }`}
            >
              Categories
            </Link>
            <Link href="/auth/signup">
              <Button
                className={`transition-all ${
                  isScrolled
                    ? 'bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg'
                    : 'bg-white text-primary hover:bg-white/90 shadow-lg'
                }`}
              >
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

