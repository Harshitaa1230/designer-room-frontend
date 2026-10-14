import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from '@/pages/HomePage'

describe('HomePage', () => {
  it('renders the app title and main hero headings', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { name: /designers room/i, hidden: true }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Your design journey,/i)).toBeInTheDocument()
    expect(screen.getByText(/all in one room\./i)).toBeInTheDocument()
  })

  it('renders all 6 design features', () => {
    render(<HomePage />)
    expect(screen.getByText(/All the pieces,/i)).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Roadmaps' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Theory' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Weekly Challenge' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Community (Soon)' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Progress & Streaks' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Learn From Me' })).toBeInTheDocument()
  })

  it('renders the CTA section and allows opening the signup modal', () => {
    render(<HomePage />)
    expect(screen.getByText(/Your room is ready\. Come in/i)).toBeInTheDocument()

    const createAccountBtn = screen.getByRole('button', { name: /create an account/i })
    expect(createAccountBtn).toBeInTheDocument()

    // Trigger open modal in standalone HomePage mode
    fireEvent.click(createAccountBtn)
    expect(screen.getByText(/Join Designers Room/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start growing/i })).toBeInTheDocument()
  })
})
