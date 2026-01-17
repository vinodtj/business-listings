import { RegisterBusinessForm } from '@/components/RegisterBusinessForm'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default function RegisterBusinessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <RegisterBusinessForm />
      <Footer />
    </div>
  )
}

