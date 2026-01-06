import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    const business = await prisma.business.update({
      where: { id: businessId },
      data: { status: 'APPROVED' },
    })

    return NextResponse.redirect(new URL('/admin/businesses?approved=true', request.url))
  } catch (error: any) {
    console.error('Error approving business:', error)
    return NextResponse.json(
      { error: 'Failed to approve business' },
      { status: 500 }
    )
  }
}

