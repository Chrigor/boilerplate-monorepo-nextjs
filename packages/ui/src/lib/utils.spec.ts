import { expect, test } from 'vitest'
import { cn } from './utils'

test('Should return merge between classes', () => {
  expect(cn('bg-primary-400', 'text-white')).toBe('bg-primary-400 text-white')
})