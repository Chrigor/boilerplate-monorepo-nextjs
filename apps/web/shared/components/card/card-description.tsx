import { type ComponentProps } from 'react'

type CardDescriptionProps = ComponentProps<'p'>

export function CardDescription({ className = '', children, ...props }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  )
}
