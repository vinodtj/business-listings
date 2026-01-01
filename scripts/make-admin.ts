import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error('❌ Please provide an email address')
    console.log('\nUsage: npx ts-node --compiler-options \'{"module":"CommonJS"}\' scripts/make-admin.ts <email>')
    process.exit(1)
  }

  console.log(`🔍 Looking for user with email: ${email}`)

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.error(`❌ User with email ${email} not found`)
    console.log('\n💡 Make sure the user has signed up first at /auth/signup')
    process.exit(1)
  }

  if (user.role === 'SUPER_ADMIN') {
    console.log(`✅ User ${email} is already a SUPER_ADMIN`)
    process.exit(0)
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'SUPER_ADMIN' },
  })

  console.log(`\n✅ Successfully upgraded ${email} to SUPER_ADMIN`)
  console.log(`\n📋 User details:`)
  console.log(`   Email: ${updatedUser.email}`)
  console.log(`   Role: ${updatedUser.role}`)
  console.log(`   ID: ${updatedUser.id}`)
  console.log(`\n🔐 You can now sign in at /auth/signin and access /admin`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

