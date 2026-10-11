import { useState, type FormEvent } from 'react'
import { X, Sparkles, CheckCircle2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signup' | 'practice'
}

export const AuthModal = ({ isOpen, onClose, initialMode = 'signup' }: AuthModalProps) => {
  const [mode, setMode] = useState<'signup' | 'signin'>(
    initialMode === 'practice' ? 'signup' : 'signup',
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      // Simulate success and close after 2 seconds
    }, 2000)
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#101010] p-6 text-white shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-amber-500 opacity-40 blur-[40px] filter" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubmitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-white">Welcome to Designers Room!</h3>
            <p className="mb-6 max-w-xs text-sm text-zinc-400">
              Your room is being prepared. Check your inbox at{' '}
              <span className="font-medium text-amber-300">{email}</span> for your early access
              pass.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white px-6 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium tracking-wider text-amber-300">
                <Sparkles className="h-3 w-3" />
                <span>EARLY ACCESS</span>
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-white">
                {mode === 'signup' ? 'Join Designers Room' : 'Welcome back'}
              </h3>
              <p className="mt-1.5 text-xs text-zinc-400">
                Structured paths, weekly challenges, and a community of creators.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="mb-6 grid grid-cols-2 rounded-lg border border-zinc-800 bg-zinc-900 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`cursor-pointer rounded-md py-1.5 transition-all ${
                  mode === 'signup'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`cursor-pointer rounded-md py-1.5 transition-all ${
                  mode === 'signin'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full cursor-pointer rounded-full bg-[#f4ece1] py-3 text-xs font-semibold text-zinc-950 shadow-md transition-all hover:bg-white active:scale-[0.99] sm:text-sm"
              >
                {mode === 'signup' ? 'Start Growing' : 'Sign In'}
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] text-zinc-500">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
