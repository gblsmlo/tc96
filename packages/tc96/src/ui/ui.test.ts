import { describe, expect, test } from 'bun:test'
import { buttonVariants } from './button'

describe('canonical ui', () => {
  test('keeps the preferred compact button contract', () => {
    const className = buttonVariants({ size: 'sm', variant: 'outline' })

    expect(className).toContain('h-8')
    expect(className).toContain('border-input')
  })
})
