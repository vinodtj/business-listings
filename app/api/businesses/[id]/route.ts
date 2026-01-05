import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

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
    const {
      name,
      slug,
      mediaGallery,
      logoUrl,
      description,
      categoryId,
      whatsapp,
      whatsappNumber,
      address,
      city,
      geoLat,
      geoLng,
      phone,
      websiteUrl,
      socialLinks,
      rating,
      status, // Allow status to be set (for admin approval workflow)
    } = body

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

    // Validate required fields - whatsappNumber is required
    const whatsappValue = whatsapp || whatsappNumber
    if (whatsappValue === undefined && !business.whatsappNumber) {
      return NextResponse.json(
        { error: 'WhatsApp number is required' },
        { status: 400 }
      )
    }

    // Check slug uniqueness if slug is being updated
    if (slug !== undefined && slug !== business.slug) {
      const existingBusiness = await prisma.business.findUnique({
        where: { slug },
      })
      if (existingBusiness && existingBusiness.id !== params.id) {
        return NextResponse.json(
          { error: 'A business with this slug already exists. Please choose a different slug.' },
          { status: 400 }
        )
      }
    }

    // Validate category exists if categoryId is being updated
    if (categoryId !== undefined && categoryId !== business.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      })
      if (!category) {
        return NextResponse.json(
          { error: 'Invalid category selected' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (categoryId !== undefined) {
      // Use relation syntax for category update
      updateData.category = { connect: { id: categoryId } }
    }
    if (mediaGallery !== undefined && Array.isArray(mediaGallery)) updateData.mediaGallery = mediaGallery
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl || undefined
    if (description !== undefined) updateData.description = description
    // Update whatsappNumber (the required field)
    // Note: We're only updating whatsappNumber to avoid Prisma errors
    // The whatsapp field is optional and may cause issues if not properly synced
    if (whatsapp !== undefined || whatsappNumber !== undefined) {
      const whatsappValue = whatsapp || whatsappNumber
      updateData.whatsappNumber = whatsappValue
    }
    if (address !== undefined) updateData.address = address
    if (city !== undefined) updateData.city = city
    if (geoLat !== undefined) updateData.geoLat = geoLat ? parseFloat(geoLat) : null
    if (geoLng !== undefined) updateData.geoLng = geoLng ? parseFloat(geoLng) : null
    if (phone !== undefined) updateData.phone = phone
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks
    if (rating !== undefined) updateData.rating = rating ? parseFloat(rating) : undefined
    
    // If status is explicitly provided (by admin), use it
    // Otherwise, if any significant business field is updated, set to PENDING for admin approval
    if (status !== undefined) {
      updateData.status = status
    } else {
      // Check if any significant business information is being updated
      const significantFields = ['name', 'slug', 'description', 'categoryId', 'address', 'city', 'whatsappNumber', 'phone', 'websiteUrl']
      const hasSignificantChanges = significantFields.some(field => body[field] !== undefined)
      
      if (hasSignificantChanges) {
        // Set status to PENDING for admin approval when business info is edited
        updateData.status = 'PENDING'
      }
    }

    // Update business
    const updatedBusiness = await prisma.business.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(
      { message: 'Business updated successfully', business: updatedBusiness },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating business:', error)
    
    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field'
      return NextResponse.json(
        { error: `A business with this ${field} already exists. Please choose a different value.` },
        { status: 400 }
      )
    }
    
    // Handle Prisma foreign key constraint violations
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid reference. Please check your category selection.' },
        { status: 400 }
      )
    }
    
    // Handle Prisma record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to update business', details: error.message },
      { status: 500 }
    )
  }
}

