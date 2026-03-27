import { render, screen } from '@testing-library/react'
import { Card } from '.'

describe('Card.Root', () => {
  it('should render children', () => {
    render(<Card.Root>conteúdo</Card.Root>)

    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('should render as a div', () => {
    render(<Card.Root data-testid="root">conteúdo</Card.Root>)

    expect(screen.getByTestId('root').tagName).toBe('DIV')
  })

  it('should apply base styles', () => {
    render(<Card.Root data-testid="root">conteúdo</Card.Root>)
    const el = screen.getByTestId('root')

    expect(el.className).toContain('rounded-lg')
    expect(el.className).toContain('border')
    expect(el.className).toContain('bg-white')
    expect(el.className).toContain('shadow-sm')
  })

  it('should merge custom className', () => {
    render(<Card.Root data-testid="root" className="mt-4">conteúdo</Card.Root>)

    expect(screen.getByTestId('root').className).toContain('mt-4')
  })

  it('should forward HTML attributes', () => {
    render(<Card.Root data-testid="root">conteúdo</Card.Root>)

    expect(screen.getByTestId('root')).toBeInTheDocument()
  })
})

describe('Card.Image', () => {
  it('should render an img element', () => {
    render(<Card.Image src="/img.png" alt="foto" />)

    expect(screen.getByRole('img', { name: 'foto' })).toBeInTheDocument()
  })

  it('should apply object-cover to the img', () => {
    render(<Card.Image src="/img.png" alt="foto" />)

    expect(screen.getByRole('img').className).toContain('object-cover')
  })

  it('should merge custom className on the img', () => {
    render(<Card.Image src="/img.png" alt="foto" className="brightness-75" />)

    expect(screen.getByRole('img').className).toContain('brightness-75')
  })
})

describe('Card.Content', () => {
  it('should render children', () => {
    render(<Card.Content>corpo</Card.Content>)

    expect(screen.getByText('corpo')).toBeInTheDocument()
  })

  it('should apply padding', () => {
    render(<Card.Content data-testid="content">corpo</Card.Content>)

    expect(screen.getByTestId('content').className).toContain('p-6')
  })

  it('should merge custom className', () => {
    render(<Card.Content data-testid="content" className="gap-4">corpo</Card.Content>)

    expect(screen.getByTestId('content').className).toContain('gap-4')
  })
})

describe('Card.Header', () => {
  it('should render children', () => {
    render(<Card.Header>cabeçalho</Card.Header>)

    expect(screen.getByText('cabeçalho')).toBeInTheDocument()
  })

  it('should merge custom className', () => {
    render(<Card.Header data-testid="header" className="mb-2">cabeçalho</Card.Header>)

    expect(screen.getByTestId('header').className).toContain('mb-2')
  })
})

describe('Card.Title', () => {
  it('should render children', () => {
    render(<Card.Title>Título do card</Card.Title>)

    expect(screen.getByText('Título do card')).toBeInTheDocument()
  })

  it('should render as h3', () => {
    render(<Card.Title>Título</Card.Title>)

    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('should apply font-semibold', () => {
    render(<Card.Title>Título</Card.Title>)

    expect(screen.getByRole('heading').className).toContain('font-semibold')
  })

  it('should merge custom className', () => {
    render(<Card.Title className="text-xl">Título</Card.Title>)

    expect(screen.getByRole('heading').className).toContain('text-xl')
  })
})

describe('Card.Description', () => {
  it('should render children', () => {
    render(<Card.Description>Descrição do card</Card.Description>)

    expect(screen.getByText('Descrição do card')).toBeInTheDocument()
  })

  it('should render as a paragraph', () => {
    render(<Card.Description data-testid="desc">Descrição</Card.Description>)

    expect(screen.getByTestId('desc').tagName).toBe('P')
  })

  it('should apply muted text color', () => {
    render(<Card.Description data-testid="desc">Descrição</Card.Description>)

    expect(screen.getByTestId('desc').className).toContain('text-gray-500')
  })

  it('should merge custom className', () => {
    render(<Card.Description data-testid="desc" className="line-clamp-2">Descrição</Card.Description>)

    expect(screen.getByTestId('desc').className).toContain('line-clamp-2')
  })
})

describe('Card (composition)', () => {
  it('should render a full card with image', () => {
    render(
      <Card.Root>
        <Card.Image src="/img.png" alt="capa" />
        <Card.Content>
          <Card.Header>
            <Card.Title>Título do card</Card.Title>
            <Card.Description>Descrição concisa do card.</Card.Description>
          </Card.Header>
        </Card.Content>
      </Card.Root>,
    )

    expect(screen.getByRole('img', { name: 'capa' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Título do card' })).toBeInTheDocument()
    expect(screen.getByText('Descrição concisa do card.')).toBeInTheDocument()
  })

  it('should render a card without image', () => {
    render(
      <Card.Root>
        <Card.Content>
          <Card.Header>
            <Card.Title>Sem imagem</Card.Title>
            <Card.Description>Apenas texto.</Card.Description>
          </Card.Header>
        </Card.Content>
      </Card.Root>,
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sem imagem' })).toBeInTheDocument()
  })
})
