'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
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

