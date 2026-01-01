import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'business' or 'product'
    const businessId = formData.get('businessId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = type === 'business' 
      ? `businesses/${businessId || 'general'}/${fileName}`
      : `products/${fileName}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from('business-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      
      // Provide helpful error messages
      let errorMessage = 'Failed to upload file'
      if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('does not exist')) {
        errorMessage = 'Storage bucket "business-images" not found. Please create it in Supabase Dashboard → Storage.'
      } else if (uploadError.message.includes('new row violates row-level security')) {
        errorMessage = 'Storage bucket RLS policy issue. Please check storage policies in Supabase.'
      } else {
        errorMessage = uploadError.message
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: uploadError.message,
          hint: 'Make sure the "business-images" bucket exists and is public. See STORAGE_SETUP.md for instructions.'
        },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('business-images')
      .getPublicUrl(filePath)

    return NextResponse.json(
      { 
        message: 'File uploaded successfully',
        url: urlData.publicUrl,
        path: filePath,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    )
  }
}

