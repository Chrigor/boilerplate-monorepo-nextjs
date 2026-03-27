import { useState } from 'react'

type UseCountOptions = {
  initialValue?: number
  min?: number
  max?: number
}

type UseCountReturn = {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export function useCount({ initialValue = 0, min = -Infinity, max = Infinity }: UseCountOptions = {}): UseCountReturn {
  const [count, setCount] = useState(initialValue)

  const increment = () => {
    setCount((prev) => Math.min(prev + 1, max))
  }

  const decrement = () => {
    setCount((prev) => Math.max(prev - 1, min))
  }

  const reset = () => setCount(initialValue)

  return { count, increment, decrement, reset }
}
