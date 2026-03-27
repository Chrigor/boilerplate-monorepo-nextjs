import { renderHook, act } from '@testing-library/react'
import { useCount } from './use-count'

describe('useCount', () => {
  it('should start with 0 by default', () => {
    const { result } = renderHook(() => useCount())

    expect(result.current.count).toBe(0)
  })

  it('should start with the provided initialValue', () => {
    const { result } = renderHook(() => useCount({ initialValue: 10 }))

    expect(result.current.count).toBe(10)
  })

  it('should increment the count', () => {
    const { result } = renderHook(() => useCount())

    act(() => result.current.increment())

    expect(result.current.count).toBe(1)
  })

  it('should decrement the count', () => {
    const { result } = renderHook(() => useCount({ initialValue: 5 }))

    act(() => result.current.decrement())

    expect(result.current.count).toBe(4)
  })

  it('should reset to initialValue', () => {
    const { result } = renderHook(() => useCount({ initialValue: 3 }))

    act(() => result.current.increment())
    act(() => result.current.increment())
    act(() => result.current.reset())

    expect(result.current.count).toBe(3)
  })

  it('should not exceed max when incrementing', () => {
    const { result } = renderHook(() => useCount({ initialValue: 9, max: 10 }))

    act(() => result.current.increment())
    act(() => result.current.increment())

    expect(result.current.count).toBe(10)
  })

  it('should not go below min when decrementing', () => {
    const { result } = renderHook(() => useCount({ initialValue: 1, min: 0 }))

    act(() => result.current.decrement())
    act(() => result.current.decrement())

    expect(result.current.count).toBe(0)
  })
})
