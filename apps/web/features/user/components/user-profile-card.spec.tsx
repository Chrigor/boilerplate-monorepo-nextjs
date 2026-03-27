import { render, screen } from '@testing-library/react'
import { faker } from '@faker-js/faker'

jest.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))
import type { User } from 'business-core/domain/entities/user.entity'
import { UserProvider } from 'features/providers/user-provider/user-provider'
import { UserProfileCard } from './user-profile-card'

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['ADMIN', 'VIWER'] as const),
    accountId: faker.string.uuid(),
    ...overrides,
  }
}

function renderWithUser(user: User) {
  return render(
    <UserProvider user={user}>
      <UserProfileCard />
    </UserProvider>,
  )
}

describe('UserProfileCard', () => {
  it('should render user name', () => {
    const user = makeUser()

    renderWithUser(user)

    expect(screen.getByText(user.name)).toBeInTheDocument()
  })

  it('should render user email', () => {
    const user = makeUser()

    renderWithUser(user)

    expect(screen.getByText(user.email)).toBeInTheDocument()
  })

  it('should render user role', () => {
    const user = makeUser()

    renderWithUser(user)

    expect(screen.getByText(user.role)).toBeInTheDocument()
  })

  it('should render user accountId', () => {
    const user = makeUser()

    renderWithUser(user)

    expect(screen.getByText(user.accountId)).toBeInTheDocument()
  })

  it('should show the first letter of the name as avatar when avatar is not set', () => {
    const user = makeUser({ avatar: undefined })

    renderWithUser(user)

    expect(screen.getByText(user.name.charAt(0).toUpperCase())).toBeInTheDocument()
  })

  it('should render an image when avatar is set', () => {
    const user = makeUser({ avatar: 'https://example.com/avatar.jpg' })

    renderWithUser(user)

    expect(screen.getByRole('img', { name: user.name })).toBeInTheDocument()
  })

  it('should show "Interno: Sim" when isInternal is true', () => {
    const user = makeUser({ isInternal: true })

    renderWithUser(user)

    expect(screen.getByText('Sim')).toBeInTheDocument()
  })

  it('should show "Interno: Não" when isInternal is false', () => {
    const user = makeUser({ isInternal: false })

    renderWithUser(user)

    expect(screen.getByText('Não')).toBeInTheDocument()
  })

  it('should not render the "Interno" field when isInternal is undefined', () => {
    const user = makeUser({ isInternal: undefined })

    renderWithUser(user)

    expect(screen.queryByText('Interno')).not.toBeInTheDocument()
  })

  it('should render "Criado em" with formatted date when createdAt is set', () => {
    const user = makeUser({ createdAt: '2024-06-15T00:00:00.000Z' })

    renderWithUser(user)

    const formatted = new Date('2024-06-15T00:00:00.000Z').toLocaleDateString('pt-BR')
    expect(screen.getByText(formatted)).toBeInTheDocument()
  })

  it('should not render "Criado em" when createdAt is not set', () => {
    const user = makeUser({ createdAt: undefined })

    renderWithUser(user)

    expect(screen.queryByText('Criado em')).not.toBeInTheDocument()
  })
})
