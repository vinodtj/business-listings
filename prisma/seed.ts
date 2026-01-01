import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create or get a test user for businesses (if needed)
  let testUser = await prisma.user.findFirst({
    where: { email: 'test@example.com' },
  })

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        role: 'BUSINESS_OWNER',
      },
    })
    console.log('✅ Created test user')
  }

  // Create Categories
  const categories = [
    {
      name: 'Beauty & Personal Care',
      slug: 'beauty-personal-care',
      description: 'Beauty salons, skincare, cosmetics, and personal care services.',
      icon: '💄',
      imageUrl: null,
    },
    {
      name: 'Fashion & Modest Wear',
      slug: 'fashion-modest-wear',
      description: 'Clothing stores, modest fashion, accessories, and fashion boutiques.',
      icon: '👗',
      imageUrl: null,
    },
    {
      name: 'Food & Home-Based Catering',
      slug: 'food-home-based-catering',
      description: 'Home-based food businesses, catering services, and homemade food.',
      icon: '🍲',
      imageUrl: null,
    },
    {
      name: 'Wellness & Fitness',
      slug: 'wellness-fitness',
      description: 'Fitness centers, yoga studios, wellness programs, and health coaching.',
      icon: '🧘',
      imageUrl: null,
    },
    {
      name: 'Handmade & Creative Businesses',
      slug: 'handmade-creative-businesses',
      description: 'Handcrafted items, artisanal products, and creative handmade businesses.',
      icon: '🎨',
      imageUrl: null,
    },
    {
      name: 'Digital & Online Services',
      slug: 'digital-online-services',
      description: 'Web design, digital marketing, online consulting, and tech services.',
      icon: '💻',
      imageUrl: null,
    },
    {
      name: 'Kids & Parenting',
      slug: 'kids-parenting',
      description: 'Children\'s products, parenting services, kids activities, and family services.',
      icon: '👶',
      imageUrl: null,
    },
    {
      name: 'Event & Lifestyle Services',
      slug: 'event-lifestyle-services',
      description: 'Event planning, party services, lifestyle consulting, and celebration services.',
      icon: '🎉',
      imageUrl: null,
    },
    {
      name: 'Education & Coaching',
      slug: 'education-coaching',
      description: 'Tutoring, educational services, skill development, and learning programs.',
      icon: '📚',
      imageUrl: null,
    },
    {
      name: 'Health-Focused Small Businesses',
      slug: 'health-focused-small-businesses',
      description: 'Health products, natural remedies, health consulting, and wellness products.',
      icon: '🌿',
      imageUrl: null,
    },
    {
      name: 'Photography & Creative Media',
      slug: 'photography-creative-media',
      description: 'Photography services, videography, content creation, and media services.',
      icon: '📸',
      imageUrl: null,
    },
    {
      name: 'Home & Lifestyle',
      slug: 'home-lifestyle',
      description: 'Home decor, interior design, lifestyle products, and home services.',
      icon: '🏡',
      imageUrl: null,
    },
    {
      name: 'Personal Coach',
      slug: 'personal-coach',
      description: 'Personal coaching, life coaching, and personal development services.',
      icon: '🎯',
      imageUrl: null,
    },
    {
      name: 'Life Coach',
      slug: 'life-coach',
      description: 'Life coaching, career coaching, and transformational coaching services.',
      icon: '🌟',
      imageUrl: null,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    console.log(`✅ Created category: ${category.name}`)
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

