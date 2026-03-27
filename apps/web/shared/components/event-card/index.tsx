import { Card } from 'shared/components/card'

type EventCardProps = {
  title: string
  description: string
  image?: { src: string; alt: string }
}

export function EventCard({ title, description, image }: EventCardProps) {
  return (
    <Card.Root>
      {image && <Card.Image src={image.src} alt={image.alt} />}
      <Card.Content>
        <Card.Header>
          <Card.Title>{title}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Card.Header>
      </Card.Content>
    </Card.Root>
  )
}
