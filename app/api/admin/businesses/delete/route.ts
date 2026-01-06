import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    await requireSuperAdmin()

    const formData = await request.formData()
    const businessId = formData.get('businessId') as string

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      )
    }

    await prisma.business.delete({
      where: { id: businessId },
    })

    return NextResponse.redirect(new URL('/admin/businesses?deleted=true', request.url))
  } catch (error: any) {
    console.error('Error deleting business:', error)
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    )
  }
}

