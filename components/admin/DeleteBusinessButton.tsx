'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DeleteBusinessButtonProps {
  businessId: string
}

export function DeleteBusinessButton({ businessId }: DeleteBusinessButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return
    }

    const formData = new FormData()
    formData.append('businessId', businessId)

    try {
      const response = await fetch('/api/admin/businesses/delete', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete business')
      }
    } catch (error) {
      console.error('Error deleting business:', error)
      alert('Failed to delete business')
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-red-600 hover:text-red-700"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}

