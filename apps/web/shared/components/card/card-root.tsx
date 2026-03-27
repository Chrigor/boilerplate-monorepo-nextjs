import { type ComponentProps } from 'react'

type CardRootProps = ComponentProps<'div'>

export function CardRoot({ className = '', children, ...props }: CardRootProps) {
  return (
    <div
      className={`flex overflow-hidden rounded-lg border bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
