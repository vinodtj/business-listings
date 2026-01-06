import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { businessId, name, price, description, imageUrl } = body

    // Validate required fields
    if (!businessId || !name || price === undefined || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify business belongs to user
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: user.id,
      },
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found or access denied' },
        { status: 404 }
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        businessId,
        name,
        price: parseFloat(price),
        description,
        imageUrl: imageUrl || null,
      },
    })

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    )
  }
}

