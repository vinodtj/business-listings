'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="relative bg-white rounded-2xl shadow-soft border border-gray-200/50 p-2 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 pl-4">
            <Search className="text-gray-400 h-5 w-5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search businesses, categories, or services..."
              className="w-full py-3 focus:outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <Button 
            type="submit"
            size="lg" 
            className="bg-primary hover:bg-primary/90 px-8 shadow-md hover:shadow-lg transition-all"
          >
            Search
          </Button>
        </div>
      </form>
      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          Popular: Restaurants, Shopping, Services
        </span>
      </div>
    </div>
  )
}

