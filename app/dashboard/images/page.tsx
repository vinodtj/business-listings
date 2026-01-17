'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function BusinessImagesPage() {
  const router = useRouter()
  
  const [businesses, setBusinesses] = useState<any[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get businessId from URL if present
    let businessIdFromUrl: string | null = null
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      businessIdFromUrl = urlParams.get('businessId')
    }
    
    fetchBusinesses(businessIdFromUrl)
  }, [])

  useEffect(() => {
    if (selectedBusiness) {
      fetchBusinessImages()
    }
  }, [selectedBusiness])

  const fetchBusinesses = async (businessIdFromUrl: string | null = null) => {
    try {
      const response = await fetch('/api/businesses/my-businesses')
      const data = await response.json()
      setBusinesses(data)
      if (data.length > 0) {
        // Use businessId from URL if provided, otherwise use first business
        const initialBusinessId = businessIdFromUrl || data[0].id
        if (initialBusinessId) {
          setSelectedBusiness(initialBusinessId)
        }
      }
    } catch (err) {
      console.error('Error fetching businesses:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBusinessImages = async () => {
    try {
      const response = await fetch(`/api/businesses/${selectedBusiness}`)
      const data = await response.json()
      const mediaGallery = data.mediaGallery || []
      setImages(Array.isArray(mediaGallery) ? mediaGallery : [])
    } catch (err) {
      console.error('Error fetching images:', err)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !selectedBusiness) return

    try {
      setUploading(true)
      setError(null)

      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('type', 'business')
        uploadFormData.append('businessId', selectedBusiness)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          const errorMsg = errorData.hint 
            ? `${errorData.error}\n\n${errorData.hint}`
            : errorData.error || 'Failed to upload image'
          throw new Error(errorMsg)
        }

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const updatedImages = [...images, ...uploadedUrls]

      // Update business with new images
      const updateResponse = await fetch(`/api/businesses/${selectedBusiness}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaGallery: updatedImages }),
      })

      if (!updateResponse.ok) {
        throw new Error('Failed to update business images')
      }

      setImages(updatedImages)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload images'
      setError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (imageUrl: string) => {
    if (!confirm('Are you sure you want to remove this image?')) return

    try {
      const updatedImages = images.filter((img) => img !== imageUrl)

      const response = await fetch(`/api/businesses/${selectedBusiness}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaGallery: updatedImages }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove image')
      }

      setImages(updatedImages)
    } catch (err: any) {
      setError(err.message || 'Failed to remove image')
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

  if (businesses.length === 0) {
    return (
      <div className="space-y-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No businesses found. Register a business first.</p>
            <Link href="/register-business">
              <Button className="mt-4">Register Business</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Images</h1>
          <p className="text-gray-600 mt-2">Upload and manage images for your business</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Business</CardTitle>
          <CardDescription>Choose which business to manage images for</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {businesses.map((business: any) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Upload multiple images to showcase your business. These will appear in the business listing carousel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 whitespace-pre-line">
              {error}
            </div>
          )}
          <div>
            <input
              id="business-images-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading || !selectedBusiness}
            />
            <label htmlFor="business-images-upload" className="cursor-pointer">
              <Button 
                type="button" 
                variant="outline" 
                disabled={uploading || !selectedBusiness}
                className="cursor-pointer"
                onClick={(e) => {
                  // Prevent any default behavior
                  e.preventDefault()
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </label>
            {!selectedBusiness && (
              <p className="text-sm text-gray-500 mt-2">Please select a business first</p>
            )}
          </div>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Images ({images.length})</CardTitle>
            <CardDescription>Click the X to remove an image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden border">
                    <Image
                      src={imageUrl}
                      alt={`Business image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveImage(imageUrl)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

