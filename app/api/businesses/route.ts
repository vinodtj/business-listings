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
    const {
      name,
      slug,
      description,
      categoryId,
      whatsapp,
      whatsappNumber, // Keep for backward compatibility
      address,
      city,
      geoLat,
      geoLng,
      phone,
      websiteUrl,
      socialLinks,
      rating,
      logoUrl,
      mediaGallery,
      userId,
    } = body

    // Validate required fields
    const whatsappValue = whatsapp || whatsappNumber
    if (!name || !slug || !description || !categoryId || !whatsappValue) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, description, categoryId, and whatsapp are required' },
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
        whatsapp: whatsappValue,
        whatsappNumber: whatsappValue, // Keep for backward compatibility
        address: address || null,
        city: city || null,
        geoLat: geoLat ? parseFloat(geoLat) : null,
        geoLng: geoLng ? parseFloat(geoLng) : null,
        phone: phone || null,
        websiteUrl: websiteUrl || null,
        socialLinks: socialLinks || null,
        rating: rating ? parseFloat(rating) : null,
        logoUrl: logoUrl || null,
        mediaGallery: mediaGallery && Array.isArray(mediaGallery) && mediaGallery.length > 0 ? mediaGallery : null,
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

