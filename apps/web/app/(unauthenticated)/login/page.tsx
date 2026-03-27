'use client'

import { useRouter } from 'next/navigation'
import { LoginForm } from 'features/login/components/login-form'
import { useAuthStore } from 'features/providers/user-provider/stores/auth.store'
import type { User } from 'business-core/domain/entities/user.entity'

const MOCK_USER: User = {
  id: 'mock-user-id-00000001',
  name: 'Usuário Mock',
  email: 'mock@example.com',
  role: 'ADMIN',
  accountId: 'mock-account-id-00000001',
}

export default function Login() {
  const setUser = useAuthStore((state) => state.setUser)
  const router = useRouter()

  const onSubmit = () => {
    setUser(MOCK_USER)
    router.push('/user-profile')
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <LoginForm onSubmit={onSubmit} />
    </main>
  )
}
