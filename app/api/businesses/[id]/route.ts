import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const business = await prisma.business.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(business)
  } catch (error: any) {
    console.error('Error fetching business:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { mediaGallery, logoUrl, description, whatsappNumber } = body

    // Verify business belongs to user
    const business = await prisma.business.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found or access denied' },
        { status: 404 }
      )
    }

    // Update business
    const updatedBusiness = await prisma.business.update({
      where: { id: params.id },
      data: {
        ...(mediaGallery !== undefined && { mediaGallery }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(description !== undefined && { description }),
        ...(whatsappNumber !== undefined && { whatsappNumber }),
      },
    })

    return NextResponse.json(
      { message: 'Business updated successfully', business: updatedBusiness },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { error: 'Failed to update business', details: error.message },
      { status: 500 }
    )
  }
}

