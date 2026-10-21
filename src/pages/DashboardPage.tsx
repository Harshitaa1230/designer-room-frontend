import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LogOut, MonitorSmartphone, Pencil, Save, Shield, X } from 'lucide-react'
import { logout, logoutAll, messageOf } from '@/lib/api'
import { getMe, listRoadmaps, updateMe } from '@/lib/endpoints'
import { useAuthStore } from '@/store/auth'
import { Spinner } from '@/components/LoadingState'

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-[20px] border border-[#302923] bg-[#11100f] p-6 sm:p-7 ${className}`}
    >
      {children}
    </section>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const setStoreUser = useAuthStore((s) => s.setUser)
  const resetAuth = useAuthStore((s) => s.reset)

  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(user?.name ?? '')
  const [sessionBusy, setSessionBusy] = useState<'single' | 'all' | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [confirmAll, setConfirmAll] = useState(false)

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    initialData: user ?? undefined,
  })

  const roadmapsQuery = useQuery({
    queryKey: ['roadmaps', 'preview'],
    queryFn: () => listRoadmaps({ limit: 6 }),
  })

  const nameMutation = useMutation({
    mutationFn: (name: string) => updateMe({ name }),
    onSuccess: (updated) => {
      setStoreUser(updated)
      setEditingName(false)
      queryClient.setQueryData(['me'], updated)
    },
  })

  const handleLogout = async (all: boolean) => {
    if (sessionBusy) return
    setSessionBusy(all ? 'all' : 'single')
    setSessionError(null)
    try {
      if (all) await logoutAll()
      else await logout()
    } catch (err) {
      // A failed call must not trap the user in a broken session locally.
      setSessionError(messageOf(err, 'Sign-out could not reach the server.'))
    } finally {
      setSessionBusy(null)
      setConfirmAll(false)
      resetAuth()
      navigate('/login')
    }
  }

  const displayName = meQuery.data?.name ?? user?.name ?? ''
  const isEmailShown = meQuery.data?.email ?? user?.email ?? ''
  const role = meQuery.data?.role ?? user?.role ?? 'USER'

  return (
    <div className="w-full px-6 pt-28 pb-16 sm:px-10 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        {/* Greeting */}
        <header className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-tight font-medium tracking-[-0.03em] text-white sm:text-[40px]">
            Welcome back{displayName ? `, ${displayName.split(' ')[0]}` : ''}.
          </h1>
          <p className="max-w-[52ch] text-[15px] leading-relaxed text-[#b6ada4]">
            Your room is ready — pick a roadmap and keep the streak going.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-5">
          {/* Profile */}
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-medium text-white">Profile</h2>
              {role === 'ADMIN' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,106,26,0.4)] bg-[rgba(255,106,26,0.14)] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#ff8a4a] uppercase">
                  <Shield className="h-3 w-3" aria-hidden="true" />
                  Admin
                </span>
              )}
            </div>

            {meQuery.isError ? (
              <div className="space-y-3">
                <p className="text-sm text-[#ff8a4a]">{messageOf(meQuery.error, 'Could not load your profile.')}</p>
                <button
                  type="button"
                  onClick={() => void meQuery.refetch()}
                  className="rounded-full border border-[#302923] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04]"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] tracking-wide text-[#827a73] uppercase">Name</p>
                  {editingName ? (
                    <form
                      className="mt-1.5 flex items-center gap-2"
                      onSubmit={(e: FormEvent) => {
                        e.preventDefault()
                        const next = nameDraft.trim()
                        if (next) nameMutation.mutate(next)
                      }}
                    >
                      <input
                        autoFocus
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        maxLength={100}
                        className="min-w-0 flex-1 rounded-lg border border-[#302923] bg-[#0b0a09] px-3 py-2 text-sm text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={nameMutation.isPending || !nameDraft.trim() || nameDraft.trim() === displayName}
                        aria-label="Save name"
                        className="flex size-9 items-center justify-center rounded-lg border border-[rgba(255,106,26,0.4)] text-[#ff8a4a] transition-colors hover:bg-[rgba(255,106,26,0.12)] disabled:opacity-40"
                      >
                        {nameMutation.isPending ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        aria-label="Cancel editing"
                        onClick={() => {
                          setNameDraft(displayName)
                          setEditingName(false)
                          nameMutation.reset()
                        }}
                        className="flex size-9 items-center justify-center rounded-lg border border-[#302923] text-[#827a73] transition-colors hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-[15px] text-white">{displayName || '—'}</p>
                      <button
                        type="button"
                        aria-label="Edit name"
                        onClick={() => {
                          setNameDraft(displayName)
                          setEditingName(true)
                        }}
                        className="text-[#827a73] transition-colors hover:text-[#ff8a4a]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  {nameMutation.isError && (
                    <p className="mt-1.5 text-xs text-[#ff8a4a]">{messageOf(nameMutation.error, 'Could not save your name.')}</p>
                  )}
                </div>

                <div>
                  <p className="text-[11px] tracking-wide text-[#827a73] uppercase">Email</p>
                  <p className="mt-1 text-[15px] break-all text-white">{isEmailShown}</p>
                </div>

                {role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 rounded-full border border-[#302923] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[rgba(255,106,26,0.6)] hover:bg-[rgba(255,106,26,0.1)]"
                  >
                    <Shield className="h-3.5 w-3.5 text-[#ff6a1a]" aria-hidden="true" />
                    Manage roadmaps
                  </Link>
                )}
              </div>
            )}
          </Card>

          {/* Session */}
          <Card className="lg:col-span-3">
            <h2 className="mb-4 text-base font-medium text-white">Session</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-[40ch] text-sm text-[#b6ada4]">
                  Signed in with Google. Sign out on this device, or everywhere you are logged in.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleLogout(false)}
                  disabled={sessionBusy !== null}
                  className="btn-3d inline-flex items-center gap-2 px-5 py-2.5 text-sm disabled:cursor-wait disabled:opacity-70"
                >
                  {sessionBusy === 'single' ? <Spinner /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
                  Sign out
                </button>

                {confirmAll ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,106,26,0.4)] bg-[rgba(255,106,26,0.08)] px-3 py-1.5">
                    <span className="text-xs text-[#ff8a4a]">Sign out everywhere?</span>
                    <button
                      type="button"
                      onClick={() => void handleLogout(true)}
                      disabled={sessionBusy !== null}
                      className="text-xs font-semibold text-white underline underline-offset-2 hover:text-[#ff8a4a] disabled:opacity-60"
                    >
                      {sessionBusy === 'all' ? 'Signing out…' : 'Yes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmAll(false)}
                      className="text-xs text-[#827a73] hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmAll(true)}
                    disabled={sessionBusy !== null}
                    className="inline-flex items-center gap-2 rounded-full border border-[#302923] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04] disabled:opacity-60"
                  >
                    <MonitorSmartphone className="h-4 w-4" aria-hidden="true" />
                    Sign out everywhere
                  </button>
                )}
              </div>

              {sessionError && (
                <p role="alert" className="text-xs text-[#ff8a4a]">
                  {sessionError}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Roadmaps preview */}
        <Card>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-medium text-white">Guidebook</h2>
            <Link
              to="/roadmaps"
              className="text-xs font-medium text-[#ff8a4a] transition-colors hover:text-white"
            >
              Browse all →
            </Link>
          </div>

          {roadmapsQuery.isPending ? (
            <div className="flex items-center gap-2 py-6 text-sm text-[#827a73]">
              <Spinner /> Loading roadmaps…
            </div>
          ) : roadmapsQuery.isError ? (
            <div className="flex flex-wrap items-center gap-3 py-4">
              <p className="text-sm text-[#ff8a4a]">
                {messageOf(roadmapsQuery.error, 'Could not load roadmaps.')}
              </p>
              <button
                type="button"
                onClick={() => void roadmapsQuery.refetch()}
                className="rounded-full border border-[#302923] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04]"
              >
                Try again
              </button>
            </div>
          ) : roadmapsQuery.data.items.length === 0 ? (
            <p className="py-6 text-sm text-[#827a73]">No roadmaps published yet — check back soon.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roadmapsQuery.data.items.map((roadmap) => (
                <li key={roadmap.id}>
                  <Link
                    to={`/roadmaps/${roadmap.id}`}
                    className="flex h-full flex-col gap-1.5 rounded-xl border border-[#302923] bg-[#0b0a09] p-4 transition-all hover:border-[rgba(255,106,26,0.6)] hover:bg-[rgba(255,106,26,0.05)]"
                  >
                    <span className="text-sm font-medium text-white">{roadmap.title}</span>
                    {roadmap.description && (
                      <span className="line-clamp-2 text-xs leading-relaxed text-[#b6ada4]">
                        {roadmap.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
