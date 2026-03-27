import { type ComponentProps } from 'react'

type CardHeaderProps = ComponentProps<'div'>

export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`} {...props}>
      {children}
    </div>
  )
}
