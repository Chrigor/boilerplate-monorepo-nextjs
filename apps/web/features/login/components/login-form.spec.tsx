import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './login-form'
import type { LoginFormData } from 'business-core/presentation/schemas/login/login.schema'

function createSubmitSpy() {
  const calls: LoginFormData[] = []
  const fn = (data: LoginFormData) => { calls.push(data) }
  return { fn, getCalls: () => calls }
}

describe('LoginForm', () => {
  it('should render email and password fields', () => {
    render(<LoginForm onSubmit={() => {}} />)

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('should render the submit button', () => {
    render(<LoginForm onSubmit={() => {}} />)

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('should call onSubmit with form data when valid', async () => {
    const { fn: onSubmit, getCalls } = createSubmitSpy()
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('E-mail'), 'user@email.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(getCalls()).toEqual([{ email: 'user@email.com', password: 'senha123' }])
  })

  it('should show validation error for invalid email', async () => {
    render(<LoginForm onSubmit={() => {}} />)

    await userEvent.type(screen.getByLabelText('E-mail'), 'invalid-email')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
  })

  it('should show validation error when password is too short', async () => {
    render(<LoginForm onSubmit={() => {}} />)

    await userEvent.type(screen.getByLabelText('E-mail'), 'user@email.com')
    await userEvent.type(screen.getByLabelText('Senha'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument()
  })

  it('should not call onSubmit when fields are invalid', async () => {
    const { fn: onSubmit, getCalls } = createSubmitSpy()
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(getCalls()).toHaveLength(0)
  })
})
