import { ShieldAlert } from 'lucide-react'

interface AuthorizationErrorProps {
  message?: string
}

export function AuthorizationError({
  message = 'You need administrator access to view this page.',
}: AuthorizationErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-[#302923] bg-[#11100f] px-6 py-14 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,106,26,0.4)] bg-[rgba(255,106,26,0.12)] text-[#ff8a4a]">
        <ShieldAlert className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-medium text-white">Not authorized</h2>
      <p className="max-w-[46ch] text-sm text-[#b6ada4]">{message}</p>
    </div>
  )
}
