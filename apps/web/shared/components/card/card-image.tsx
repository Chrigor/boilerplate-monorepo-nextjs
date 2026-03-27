import { type ComponentProps } from 'react'

type CardImageProps = ComponentProps<'img'>

export function CardImage({ className = '', alt = '', ...props }: CardImageProps) {
  return (
    <div className="aspect-[9/16] shrink-0">
      <img
        alt={alt}
        className={`h-full w-full object-cover ${className}`}
        {...props}
      />
    </div>
  )
}
