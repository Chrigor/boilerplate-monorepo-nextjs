import { render, screen } from '@testing-library/react'
import { EventCard } from '.'

describe('EventCard', () => {
  it('should render title', () => {
    render(<EventCard title="Show de Rock" description="Uma noite incrível." />)

    expect(screen.getByRole('heading', { name: 'Show de Rock' })).toBeInTheDocument()
  })

  it('should render description', () => {
    render(<EventCard title="Show de Rock" description="Uma noite incrível." />)

    expect(screen.getByText('Uma noite incrível.')).toBeInTheDocument()
  })

  it('should not render image when image prop is not provided', () => {
    render(<EventCard title="Show de Rock" description="Uma noite incrível." />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should render image when image prop is provided', () => {
    render(
      <EventCard
        title="Show de Rock"
        description="Uma noite incrível."
        image={{ src: '/show.jpg', alt: 'Foto do show' }}
      />,
    )

    expect(screen.getByRole('img', { name: 'Foto do show' })).toBeInTheDocument()
  })
})
