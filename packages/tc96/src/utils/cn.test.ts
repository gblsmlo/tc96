import { describe, expect, test } from 'bun:test'
import { cn } from './index'

describe('cn', () => {
  test('combines conditional classes and resolves Tailwind conflicts', () => {
    expect(cn('inline-flex px-2', false && 'hidden', ['px-4', { 'text-sm': true }])).toBe(
      'inline-flex px-4 text-sm',
    )
  })
})
