import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ComingSoonPage } from '@/pages/ComingSoonPage'

const renderPage = (kind: 'challenge' | 'community') =>
  render(
    <MemoryRouter>
      <ComingSoonPage kind={kind} />
    </MemoryRouter>,
  )

describe('ComingSoonPage', () => {
  it('renders the challenge placeholder with navigation links', () => {
    renderPage('challenge')
    expect(
      screen.getByRole('heading', { name: /weekly challenge is almost here/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explore the guidebook/i })).toHaveAttribute(
      'href',
      '/guidebook',
    )
    expect(screen.getByRole('link', { name: /back home/i })).toHaveAttribute('href', '/')
  })

  it('renders the community placeholder', () => {
    renderPage('community')
    expect(screen.getByRole('heading', { name: /community is almost here/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /join the waitlist/i })).toHaveAttribute(
      'href',
      '/waitlist',
    )
  })
})
