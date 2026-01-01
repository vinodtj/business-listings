'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const businessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    businessId: businessId || '',
    name: '',
    price: '',
    description: '',
    imageUrl: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleUploadClick = () => {
    if (fileInputRef.current && !submitting) {
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses/my-businesses')
      const data = await response.json()
      setBusinesses(data)
      if (businessId && data.length > 0) {
        setFormData((prev) => ({ ...prev, businessId }))
      }
    } catch (err) {
      console.error('Error fetching businesses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    console.log('File selected:', file.name, file.size, file.type)

    try {
      setSubmitting(true)
      setError(null)
      
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', 'product')

      console.log('Uploading to /api/upload...')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      console.log('Upload response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Upload error:', errorData)
        const errorMsg = errorData.hint 
          ? `${errorData.error}\n\n${errorData.hint}`
          : errorData.error || 'Failed to upload image'
        throw new Error(errorMsg)
      }

      const data = await response.json()
      console.log('Upload successful:', data.url)
      setFormData((prev) => ({ ...prev, imageUrl: data.url }))
      setError(null)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      router.push('/dashboard/products?success=created')
    } catch (err: any) {
      setError(err.message || 'Failed to create product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Add a product or service to your business</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Fill in the details for your product or service</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="businessId" className="block text-sm font-medium text-gray-700 mb-1">
                Business *
              </label>
              <select
                id="businessId"
                value={formData.businessId}
                onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a business</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Premium Coffee Blend"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
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
                placeholder="Describe your product or service..."
              />
            </div>

            <div>
              <label htmlFor="product-image-upload" className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    id="product-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={submitting}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${
                      submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {submitting ? 'Uploading...' : formData.imageUrl ? 'Change Image' : 'Upload Image'}
                  </button>
                  {formData.imageUrl && (
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden border">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                {formData.imageUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Or enter image URL directly:</p>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting} size="lg">
                {submitting ? 'Creating Product...' : 'Create Product'}
              </Button>
              <Link href="/dashboard/products">
                <Button type="button" variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

