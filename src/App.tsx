import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/lib/theme'

export function AppLayout() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300 selection:bg-amber-500/25 selection:text-amber-200">
        {/* Shared navbar across all pages */}
        <Navbar />

        <main className="w-full flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
