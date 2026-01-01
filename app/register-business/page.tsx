'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase-client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function RegisterBusinessPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    whatsappNumber: '',
    logoUrl: '',
  })

  useEffect(() => {
    checkUser()
    fetchCategories()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/signin?redirect=/register-business')
        return
      }
      setUser(session.user)
    } catch (err) {
      console.error('Error checking user:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Get user from database
      const userResponse = await fetch('/api/auth/get-user')
      const { user: dbUser } = await userResponse.json()

      if (!dbUser) {
        throw new Error('User not found. Please sign up first.')
      }

      // Check if user needs to be upgraded to BUSINESS_OWNER
      if (dbUser.role === 'USER') {
        // Upgrade to BUSINESS_OWNER
        await fetch('/api/auth/upgrade-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: dbUser.id, role: 'BUSINESS_OWNER' }),
        })
      }

      // Create business
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: dbUser.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to register business')
      }

      const business = await response.json()
      router.push(`/dashboard?success=business-registered`)
    } catch (err: any) {
      setError(err.message || 'Failed to register business')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">BusinessHub</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Register Your Business</CardTitle>
            <CardDescription>
              List your business on BusinessHub and reach more customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Joe's Coffee Shop"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug *
                </label>
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  pattern="[a-z0-9-]+"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="joes-coffee-shop"
                />
                <p className="mt-1 text-sm text-gray-500">
                  This will be used in your business URL: /business/{formData.slug || 'your-slug'}
                </p>
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell customers about your business..."
                />
              </div>

              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number *
                </label>
                <input
                  id="whatsappNumber"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1234567890"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Include country code (e.g., +1 for US, +91 for India)
                </p>
              </div>

              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL (Optional)
                </label>
                <input
                  id="logoUrl"
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/logo.png"
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can add more images after registration
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your business listing will be reviewed by our team before it goes live. 
                  You'll be notified once it's approved.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Registering Business...' : 'Register Business'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

