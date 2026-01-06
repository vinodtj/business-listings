import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Removing old categories...')

  const oldCategorySlugs = [
    'restaurants-cafes',
    'retail-shopping',
    'health-wellness',
    'beauty-salons',
    'automotive',
    'home-garden',
    'education-training',
    'entertainment',
    'professional-services',
    'travel-tourism',
  ]

  for (const slug of oldCategorySlugs) {
    try {
      // Check if category has any businesses
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              businesses: true,
            },
          },
        },
      })

      if (category) {
        if (category._count.businesses > 0) {
          console.log(`⚠️  Skipping "${category.name}" - has ${category._count.businesses} businesses`)
        } else {
          await prisma.category.delete({
            where: { slug },
          })
          console.log(`✅ Deleted category: ${category.name}`)
        }
      } else {
        console.log(`ℹ️  Category "${slug}" not found`)
      }
    } catch (error: any) {
      console.error(`❌ Error deleting category "${slug}":`, error.message)
    }
  }

  console.log('✨ Cleanup completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })







