'use client'

import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button 
      onClick={scrollToTop}
      className="w-12 h-20 bg-white shadow-lg rounded-l-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors group"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
      <span className="text-[10px] font-semibold text-gray-600 group-hover:text-primary transition-colors writing-vertical-rl">
        TOP
      </span>
    </button>
  )
}

