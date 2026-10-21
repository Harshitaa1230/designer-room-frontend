import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, Mail, Users } from 'lucide-react'
import logo from '@/assets/logo.svg'
import { messageOf } from '@/lib/api'
import { joinWaitlist } from '@/lib/endpoints'
import { Spinner } from '@/components/LoadingState'

const WHATSAPP_LINK = (import.meta.env.VITE_WHATSAPP_LINK ??
  import.meta.env.VITE_WHASTAPP_LINK) as string | undefined

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)

export function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [joinedEmail, setJoinedEmail] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || busy) return

    setBusy(true)
    setError(null)
    try {
      await joinWaitlist(trimmed)
      setJoinedEmail(trimmed)
    } catch (err) {
      setError(messageOf(err, 'Could not join the waitlist right now. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-5 text-white">
      <div
        className="pointer-events-none absolute -top-32 right-[-120px] h-[420px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_60%_30%,#ff7a29_0%,#ea580c_40%,transparent_70%)] opacity-50 blur-[80px] filter"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-160px] left-[-140px] h-[380px] w-[460px] rounded-full bg-[radial-gradient(circle_at_40%_60%,#c2410c_0%,transparent_70%)] opacity-40 blur-[90px] filter"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-[20px] border border-[#302923] bg-[#11100f] p-8 shadow-2xl">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-36 w-72 -translate-x-1/2 rounded-full bg-amber-600 opacity-30 blur-[60px] filter"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="mb-8 flex flex-col items-center text-center">
            <img src={logo} alt="" aria-hidden="true" className="mb-5 h-12 w-auto" />
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,106,26,0.35)] bg-[rgba(255,106,26,0.1)] px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-[#ff8a4a] uppercase">
              <Users className="h-3 w-3" aria-hidden="true" />
              Waitlist · First beta 8 Nov
            </span>
            <h1 className="text-2xl font-medium tracking-tight text-white">
              Join Designer&rsquo;s Room
            </h1>
            <p className="mt-2 max-w-[36ch] text-sm text-[#b6ada4]">
              Your design journey, all in one room. The first beta opens on{' '}
              <span className="font-medium text-white">8 Nov</span> — drop your email to save your
              spot and hop into the community before the doors open.
            </p>
          </div>

          {joinedEmail ? (
            <div className="flex flex-col items-center text-center">
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,106,26,0.35)] bg-[rgba(255,106,26,0.1)]"
                aria-hidden="true"
              >
                <Check className="h-5 w-5 text-[#ff8a4a]" />
              </div>
              <h2 className="text-lg font-medium text-white">You&rsquo;re on the list</h2>
              <p className="mt-2 max-w-[34ch] text-sm text-[#b6ada4]">
                We saved <span className="text-white">{joinedEmail}</span>. The community is already
                buzzing — join the WhatsApp group and introduce yourself.
              </p>

              {WHATSAPP_LINK ? (
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[rgba(37,211,102,0.4)] bg-[linear-gradient(180deg,#128c4a,#0b6b38)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_6px_0_#064e29,0_16px_28px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-1.5 active:shadow-[0_0_0_#064e29,0_8px_18px_rgba(0,0,0,0.4)]"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                  Open the WhatsApp group
                </a>
              ) : (
                <p className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-[#302923] bg-[#0b0a09] px-4 py-3 text-[13px] text-[#b6ada4]">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#827a73]" aria-hidden="true" />
                  Your invite is on its way — watch your inbox.
                </p>
              )}

              <p className="mt-4 text-[11px] text-[#827a73]">
                Spot saved. Invite links rotate, so come back here anytime for a fresh one.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label
                  htmlFor="waitlist-email"
                  className="mb-1.5 block text-xs font-medium text-[#b6ada4]"
                >
                  Email address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[#302923] bg-[#0b0a09] px-3.5 py-2.5 text-white placeholder-[#57504a] transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none"
                />
              </div>

              {error && (
                <p role="alert" className="text-[13px] text-[#ff8a4a]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy || !email.trim()}
                className="btn-3d inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm disabled:cursor-wait disabled:opacity-70"
              >
                {busy && <Spinner />}
                Join the waitlist
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-[11px] leading-relaxed text-[#827a73]">
            <Link to="/" className="transition-colors hover:text-white">
              &larr; Back to home
            </Link>
            <span className="mx-2 opacity-40">·</span>
            No spam — one note when the room opens.
          </p>
        </div>
      </div>
    </div>
  )
}
