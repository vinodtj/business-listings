// Mock data for preview without database

export interface MockCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MockUser {
  id: string
  email: string
  role: 'USER' | 'BUSINESS_OWNER' | 'ADMIN' | 'SUPER_ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface MockBusiness {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  userId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  address: string | null
  city: string | null
  geoLat: number | null
  geoLng: number | null
  phone: string | null
  websiteUrl: string | null
  whatsapp: string | null
  whatsappNumber: string | null
  logoUrl: string | null
  mediaGallery: string[] | null
  socialLinks: { facebook?: string; instagram?: string; twitter?: string; linkedin?: string } | null
  rating: number | null
  createdAt: Date
  updatedAt: Date
}

export interface MockProduct {
  id: string
  businessId: string
  name: string
  description: string
  price: number | null
  imageUrl: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const mockCategories: MockCategory[] = [
  {
    id: 'cat-1',
    name: 'Restaurants',
    slug: 'restaurants',
    description: 'Best dining experiences in town',
    icon: '🍽️',
    imageUrl: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2',
    name: 'Shopping',
    slug: 'shopping',
    description: 'Shop for everything you need',
    icon: '🛍️',
    imageUrl: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-3',
    name: 'Services',
    slug: 'services',
    description: 'Professional services for your needs',
    icon: '🔧',
    imageUrl: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-4',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Fun and entertainment venues',
    icon: '🎬',
    imageUrl: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    role: 'BUSINESS_OWNER',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

const mockBusinesses: MockBusiness[] = [
  {
    id: 'biz-1',
    name: 'Delicious Pizza Place',
    slug: 'delicious-pizza-place',
    description: 'Authentic Italian pizzas made with fresh ingredients. We offer a wide variety of toppings and traditional recipes.',
    categoryId: 'cat-1',
    userId: 'user-1',
    status: 'APPROVED',
    address: '123 Main Street',
    city: 'Dubai',
    geoLat: 25.2048,
    geoLng: 55.2708,
    phone: '+971501234567',
    websiteUrl: 'https://example.com',
    whatsapp: '+971501234567',
    whatsappNumber: '+971501234567',
    logoUrl: null,
    mediaGallery: null,
    socialLinks: {
      facebook: 'https://facebook.com/deliciouspizza',
      instagram: 'https://instagram.com/deliciouspizza',
    },
    rating: 4.8,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'biz-2',
    name: 'Tech Solutions UAE',
    slug: 'tech-solutions-uae',
    description: 'Professional IT services and solutions for businesses. We provide web development, cloud services, and IT consulting.',
    categoryId: 'cat-3',
    userId: 'user-1',
    status: 'APPROVED',
    address: '456 Business Bay',
    city: 'Dubai',
    geoLat: 25.1868,
    geoLng: 55.2675,
    phone: '+971507654321',
    websiteUrl: 'https://techsolutions.ae',
    whatsapp: '+971507654321',
    whatsappNumber: '+971507654321',
    logoUrl: null,
    mediaGallery: null,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techsolutions',
    },
    rating: 4.9,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'biz-3',
    name: 'Fashion Boutique',
    slug: 'fashion-boutique',
    description: 'Trendy clothing and accessories for men and women. Latest fashion trends from international brands.',
    categoryId: 'cat-2',
    userId: 'user-1',
    status: 'APPROVED',
    address: '789 Mall Road',
    city: 'Abu Dhabi',
    geoLat: 24.4539,
    geoLng: 54.3773,
    phone: '+971508888888',
    websiteUrl: null,
    whatsapp: '+971508888888',
    whatsappNumber: '+971508888888',
    logoUrl: null,
    mediaGallery: null,
    socialLinks: {
      instagram: 'https://instagram.com/fashionboutique',
    },
    rating: 4.7,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
]

const mockProducts: MockProduct[] = [
  {
    id: 'prod-1',
    businessId: 'biz-1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato, mozzarella, and basil',
    price: 45.00,
    imageUrl: null,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'prod-2',
    businessId: 'biz-1',
    name: 'Pepperoni Pizza',
    description: 'Delicious pizza topped with pepperoni and cheese',
    price: 55.00,
    imageUrl: null,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
]

// Mock Prisma-like client
export const mockPrisma = {
  category: {
    findMany: (args?: any) => {
      let result = [...mockCategories]
      if (args?.where?.isActive !== undefined) {
        result = result.filter((c: MockCategory) => c.isActive === args.where.isActive)
      }
      if (args?.orderBy?.name) {
        result.sort((a: MockCategory, b: MockCategory) => a.name.localeCompare(b.name))
      }
      return Promise.resolve(result)
    },
    findUnique: (args: { where: { id?: string; slug?: string } }) => {
      const category = mockCategories.find(
        (c: MockCategory) => c.id === args.where.id || c.slug === args.where.slug
      )
      return Promise.resolve(category || null)
    },
    create: (args: { data: any }) => {
      const newCat: MockCategory = {
        id: `cat-${Date.now()}`,
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockCategories.push(newCat)
      return Promise.resolve(newCat)
    },
    update: (args: { where: { id: string }; data: any }) => {
      const index = mockCategories.findIndex(c => c.id === args.where.id)
      if (index === -1) return Promise.resolve(null)
      mockCategories[index] = { ...mockCategories[index], ...args.data, updatedAt: new Date() }
      return Promise.resolve(mockCategories[index])
    },
    delete: (args: { where: { id: string } }) => {
      const index = mockCategories.findIndex(c => c.id === args.where.id)
      if (index === -1) return Promise.resolve(null)
      return Promise.resolve(mockCategories.splice(index, 1)[0])
    },
    count: () => Promise.resolve(mockCategories.length),
  },
  business: {
    findMany: (args?: any) => {
      let result = [...mockBusinesses]
      if (args?.where) {
        if (args.where.status) {
          result = result.filter((b: MockBusiness) => b.status === args.where.status)
        }
        if (args.where.categoryId) {
          result = result.filter((b: MockBusiness) => b.categoryId === args.where.categoryId)
        }
        if (args.where.userId) {
          result = result.filter((b: MockBusiness) => b.userId === args.where.userId)
        }
        if (args.where.OR) {
          const searchTerm = args.where.OR[0]?.name?.contains?.toLowerCase()
          if (searchTerm) {
            result = result.filter((b: MockBusiness) =>
              b.name.toLowerCase().includes(searchTerm) ||
              b.description.toLowerCase().includes(searchTerm)
            )
          }
        }
      }
      if (args?.orderBy?.createdAt === 'desc') {
        result.sort((a: MockBusiness, b: MockBusiness) => b.createdAt.getTime() - a.createdAt.getTime())
      }
      if (args?.include?.category) {
        result = result.map((b: MockBusiness) => ({
          ...b,
          category: mockCategories.find((c: MockCategory) => c.id === b.categoryId) || null,
        }))
      }
      if (args?.include?.offers) {
        result = result.map((b: MockBusiness) => ({
          ...b,
          offers: [], // Mock offers - empty array
        }))
      }
      if (args?.include?._count) {
        result = result.map((b: MockBusiness) => ({
          ...b,
          _count: {
            products: mockProducts.filter((p: MockProduct) => p.businessId === b.id).length,
            offers: 0,
          },
        }))
      }
      if (args?.include?.user) {
        result = result.map((b: MockBusiness) => ({
          ...b,
          user: mockUsers.find((u: MockUser) => u.id === b.userId) || null,
        }))
      }
      return Promise.resolve(result)
    },
    findUnique: (args: { where: { id?: string; slug?: string }; include?: any }) => {
      const business = mockBusinesses.find(
        (b: MockBusiness) => b.id === args.where.id || b.slug === args.where.slug
      )
      if (!business) return Promise.resolve(null)
      
      let result: any = { ...business }
      
      if (args.include) {
        if (args.include.category) {
          result.category = mockCategories.find((c: MockCategory) => c.id === business.categoryId) || null
        }
        if (args.include.products) {
          let products = mockProducts.filter((p: MockProduct) => p.businessId === business.id)
          if (args.include.products.orderBy?.createdAt === 'desc') {
            products.sort((a: MockProduct, b: MockProduct) => b.createdAt.getTime() - a.createdAt.getTime())
          }
          result.products = products
        }
        if (args.include.offers) {
          result.offers = [] // Mock offers array - empty for now
        }
        if (args.include.user) {
          result.user = mockUsers.find((u: MockUser) => u.id === business.userId) || null
        }
        if (args.include._count) {
          result._count = {
            products: mockProducts.filter((p: MockProduct) => p.businessId === business.id).length,
            offers: 0,
          }
        }
      }
      
      return Promise.resolve(result)
    },
    findFirst: (args: { where: any }) => {
      const business = mockBusinesses.find((b: MockBusiness) => {
        if (args.where.id) return b.id === args.where.id
        if (args.where.slug) return b.slug === args.where.slug
        return false
      })
      if (!business) return Promise.resolve(null)
      
      const category = mockCategories.find((c: MockCategory) => c.id === business.categoryId)
      return Promise.resolve({
        ...business,
        category: category || null,
      } as any)
    },
    create: (args: { data: any; include?: any }) => {
      const newBiz: MockBusiness = {
        id: `biz-${Date.now()}`,
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockBusinesses.push(newBiz)
      const category = args.include?.category
        ? mockCategories.find((c: MockCategory) => c.id === newBiz.categoryId) || null
        : null
      return Promise.resolve({
        ...newBiz,
        category,
      } as any)
    },
    update: (args: { where: { id: string }; data: any }) => {
      const index = mockBusinesses.findIndex(b => b.id === args.where.id)
      if (index === -1) return Promise.resolve(null)
      mockBusinesses[index] = { ...mockBusinesses[index], ...args.data, updatedAt: new Date() }
      const category = mockCategories.find(c => c.id === mockBusinesses[index].categoryId)
      return Promise.resolve({
        ...mockBusinesses[index],
        category: category || null,
      } as any)
    },
    delete: (args: { where: { id: string } }) => {
      const index = mockBusinesses.findIndex(b => b.id === args.where.id)
      if (index === -1) return Promise.resolve(null)
      return Promise.resolve(mockBusinesses.splice(index, 1)[0])
    },
    count: (args?: { where?: any }) => {
      if (!args?.where) return Promise.resolve(mockBusinesses.length)
      let count = mockBusinesses.length
      if (args.where.status) {
        count = mockBusinesses.filter((b: MockBusiness) => b.status === args.where.status).length
      }
      return Promise.resolve(count)
    },
  },
  user: {
    findUnique: (args: { where: { id?: string; email?: string } }) => {
      const user = mockUsers.find(
        (u: MockUser) => u.id === args.where.id || u.email === args.where.email
      )
      return Promise.resolve(user || null)
    },
    findMany: () => Promise.resolve([...mockUsers]),
    create: (args: { data: any }) => {
      const newUser: MockUser = {
        id: `user-${Date.now()}`,
        email: args.data.email,
        role: args.data.role || 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockUsers.push(newUser)
      return Promise.resolve(newUser)
    },
    update: (args: { where: { id: string }; data: any }) => {
      const index = mockUsers.findIndex(u => u.id === args.where.id)
      if (index === -1) return Promise.resolve(null)
      mockUsers[index] = { ...mockUsers[index], ...args.data, updatedAt: new Date() }
      return Promise.resolve(mockUsers[index])
    },
  },
  product: {
    findMany: (args?: any) => {
      let result = [...mockProducts]
      if (args?.where?.businessId) {
        result = result.filter((p: MockProduct) => p.businessId === args.where.businessId)
      }
      return Promise.resolve(result)
    },
    findUnique: (args: { where: { id: string } }) => {
      const product = mockProducts.find((p: MockProduct) => p.id === args.where.id)
      return Promise.resolve(product || null)
    },
    create: (args: { data: any }) => {
      const newProd: MockProduct = {
        id: `prod-${Date.now()}`,
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockProducts.push(newProd)
      return Promise.resolve(newProd)
    },
    delete: (args: { where: { id: string } }) => {
      const index = mockProducts.findIndex(p => p.id === args.where.id)
      if (index === -1) return Promise.resolve(null)
      return Promise.resolve(mockProducts.splice(index, 1)[0])
    },
  },
}
