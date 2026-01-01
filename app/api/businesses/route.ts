import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

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
    const { name, slug, description, categoryId, whatsappNumber, logoUrl, userId } = body

    // Validate required fields
    if (!name || !slug || !description || !categoryId || !whatsappNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug is already taken
    const existingBusiness = await prisma.business.findUnique({
      where: { slug },
    })

    if (existingBusiness) {
      return NextResponse.json(
        { error: 'This business slug is already taken. Please choose another.' },
        { status: 400 }
      )
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Create business
    const business = await prisma.business.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        whatsappNumber,
        logoUrl: logoUrl || null,
        userId: userId || user.id,
        status: 'PENDING', // New businesses need approval
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(
      { message: 'Business registered successfully', business },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: 'Failed to register business', details: error.message },
      { status: 500 }
    )
  }
}

