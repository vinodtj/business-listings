'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null
}

interface ScrollableCategoryPillsProps {
  categories: Category[]
  activeCategorySlug?: string | null
}

export function ScrollableCategoryPills({ categories, activeCategorySlug }: ScrollableCategoryPillsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverPosition, setHoverPosition] = useState<'left' | 'right' | null>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startScrolling = (direction: 'left' | 'right') => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
    }

    scrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        // 'left' means scroll left (decrease scrollLeft), 'right' means scroll right (increase scrollLeft)
        const scrollAmount = direction === 'left' ? -10 : 10
        scrollContainerRef.current.scrollLeft += scrollAmount
      }
    }, 20) // Smooth scrolling every 20ms
  }

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const containerWidth = rect.width

    // Define scroll zones (20% on each side)
    const scrollZoneWidth = containerWidth * 0.2

    if (mouseX < scrollZoneWidth) {
      // Hovering on left side - scroll left (decrease scrollLeft to reveal left content)
      setHoverPosition('left')
      startScrolling('left')
    } else if (mouseX > containerWidth - scrollZoneWidth) {
      // Hovering on right side - scroll right (increase scrollLeft to reveal right content)
      setHoverPosition('right')
      startScrolling('right')
    } else {
      // In middle zone - stop scrolling
      setHoverPosition(null)
      stopScrolling()
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setHoverPosition(null)
    stopScrolling()
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  useEffect(() => {
    return () => {
      stopScrolling()
    }
  }, [])

  return (
    <div
      ref={scrollContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide"
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Link
        href="/listings"
        className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
          !activeCategorySlug
            ? 'bg-primary text-white shadow-sm'
            : 'bg-white text-gray-700 border border-gray-300 hover:border-primary/50 hover:text-primary'
        }`}
      >
        All Categories
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/listings?category=${category.slug}`}
          className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-2 ${
            activeCategorySlug === category.slug
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary/50 hover:text-primary'
          }`}
        >
          {category.icon && <span className="text-base">{category.icon}</span>}
          {category.name}
        </Link>
      ))}
    </div>
  )
}

