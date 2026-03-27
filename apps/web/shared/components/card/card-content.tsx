import { type ComponentProps } from 'react'

type CardContentProps = ComponentProps<'div'>

export function CardContent({ className = '', children, ...props }: CardContentProps) {
  return (
    <div className={`flex flex-1 flex-col p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}
