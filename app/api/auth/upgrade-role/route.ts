import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId, role } = await request.json()

    // Only allow users to upgrade themselves to BUSINESS_OWNER
    if (userId !== currentUser.id || role !== 'BUSINESS_OWNER') {
      return NextResponse.json(
        { error: 'Invalid role upgrade' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: 'BUSINESS_OWNER' },
    })

    return NextResponse.json(
      { message: 'Role upgraded successfully', user: updatedUser },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error upgrading role:', error)
    return NextResponse.json(
      { error: 'Failed to upgrade role' },
      { status: 500 }
    )
  }
}

