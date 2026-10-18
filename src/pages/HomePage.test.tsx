import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { HomePage } from '@/pages/HomePage'

const renderHome = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )

describe('HomePage', () => {
  it('renders the app title and main hero headings', () => {
    renderHome()
    expect(
      screen.getByRole('heading', { name: /designers room/i, hidden: true }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Your design journey,/i)).toBeInTheDocument()
    expect(screen.getByText(/all in one room\./i)).toBeInTheDocument()
  })

  it('renders the hero CTAs', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /start practising/i })).toHaveAttribute(
      'href',
      '#start-practising',
    )
    expect(screen.getByRole('link', { name: /browse guidebook/i })).toHaveAttribute(
      'href',
      '/roadmaps',
    )
  })

  it('renders the features list', () => {
    renderHome()
    expect(screen.getByText(/What's inside/i)).toBeInTheDocument()
    expect(screen.getByText('Roadmaps')).toBeInTheDocument()
    expect(screen.getByText('Theory')).toBeInTheDocument()
    expect(screen.getByText('Challenge')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
  })
})
