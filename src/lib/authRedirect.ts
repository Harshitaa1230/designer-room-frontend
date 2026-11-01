const AUTH_REDIRECT_KEY = 'designers-room-auth-redirect'

export function safeAuthRedirect(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard'
  }
  return value
}

export function rememberAuthRedirect(value: string | null | undefined): void {
  const redirect = safeAuthRedirect(value)
  if (redirect !== '/dashboard') {
    sessionStorage.setItem(AUTH_REDIRECT_KEY, redirect)
  }
}

export function consumeAuthRedirect(): string {
  const redirect = safeAuthRedirect(sessionStorage.getItem(AUTH_REDIRECT_KEY))
  sessionStorage.removeItem(AUTH_REDIRECT_KEY)
  return redirect
}
