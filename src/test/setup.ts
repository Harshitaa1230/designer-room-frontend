import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

vi.mock('@firecms/neat', () => ({
  NeatGradient: class {
    yOffset = 0
    destroy() {}
  },
}))

afterEach(() => {
  cleanup()
})
