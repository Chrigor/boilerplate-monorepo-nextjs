import { type ComponentProps } from 'react'

type CardTitleProps = ComponentProps<'h3'>

export function CardTitle({ className = '', children, ...props }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold leading-tight ${className}`} {...props}>
      {children}
    </h3>
  )
}
