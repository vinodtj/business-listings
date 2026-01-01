import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  if (users.length === 0) {
    console.log('📭 No users found in the database')
    console.log('\n💡 Please sign up first at http://localhost:3000/auth/signup')
  } else {
    console.log(`\n👥 Found ${users.length} user(s):\n`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   ID: ${user.id}\n`)
    })
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

