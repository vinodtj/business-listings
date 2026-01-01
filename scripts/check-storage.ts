import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('🔍 Checking Supabase Storage setup...\n')

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('\nPlease ensure these are set in your .env file:')
    console.log('  - NEXT_PUBLIC_SUPABASE_URL')
    console.log('  - SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('❌ Error accessing Supabase Storage:', listError.message)
    console.log('\n💡 Make sure your SUPABASE_SERVICE_ROLE_KEY is correct')
    process.exit(1)
  }

  const businessImagesBucket = buckets?.find(b => b.name === 'business-images')

  if (!businessImagesBucket) {
    console.log('❌ Storage bucket "business-images" not found')
    console.log('\n📋 To fix this:')
    console.log('1. Go to Supabase Dashboard → Storage')
    console.log('2. Click "New bucket"')
    console.log('3. Name: business-images')
    console.log('4. Make it Public')
    console.log('5. Click "Create bucket"')
    console.log('\nSee STORAGE_SETUP.md for detailed instructions')
  } else {
    console.log('✅ Storage bucket "business-images" exists')
    console.log(`   Public: ${businessImagesBucket.public ? 'Yes' : 'No'}`)
    
    if (!businessImagesBucket.public) {
      console.log('\n⚠️  Warning: Bucket is not public. Images may not be accessible.')
      console.log('   Make the bucket public in Supabase Dashboard → Storage → business-images → Settings')
    }
  }

  console.log('\n✨ Storage check complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

