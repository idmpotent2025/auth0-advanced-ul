'use client'

import { useEffect, useState } from 'react'
import { getBrandByOrgName, type BrandConfig } from '@/lib/brands'

// ─── Types ──────────────────────────────────────────────────────────────────

type UniversalLoginContext = {
  screen: { name: string }
  organization?: { id: string; name: string; display_name: string }
  transaction?: { state: string; errors?: { code: string; message: string }[] }
  client?: { name: string; logo_uri?: string }
}

type ScreenState =
  | { phase: 'loading' }
  | { phase: 'login-id'; errors: string[] }
  | { phase: 'login-password'; email: string; errors: string[] }
  | { phase: 'unsupported'; screenName: string }

// ─── Shell ───────────────────────────────────────────────────────────────────

function BrandedShell({
  brand,
  children,
}: {
  brand: BrandConfig
  children: React.ReactNode
}) {
  const dark = brand.textColor === '#000'
  return (
    <div
      className="min-h-full flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${brand.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: brand.bgPosition ?? 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: brand.color,
      }}
    >
      {/* Overlay to ensure contrast */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative w-full max-w-sm">
        {/* Brand stripe */}
        <div
          className="h-1.5 rounded-t-xl"
          style={{ backgroundColor: brand.color }}
        />

        {/* Card */}
        <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden">
          {/* Card header */}
          <div
            className="px-8 pt-7 pb-5 flex flex-col items-center gap-2"
            style={{ backgroundColor: brand.color + '12' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base"
              style={{ backgroundColor: brand.color }}
            >
              {brand.displayName.charAt(0)}
            </div>
            <h1 className="text-gray-900 font-bold text-lg tracking-tight">
              {brand.displayName}
            </h1>
          </div>

          {/* Card body */}
          <div className="px-8 py-7">{children}</div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] text-gray-400">
              Secured by Auth0 &middot; Powered by Okta
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Error list ──────────────────────────────────────────────────────────────

function ErrorList({ errors }: { errors: string[] }) {
  if (!errors.length) return null
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      {errors.map((e, i) => (
        <p key={i} className="text-xs text-red-700">{e}</p>
      ))}
    </div>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  defaultValue,
  required = true,
}: {
  id: string
  label: string
  type?: string
  autoComplete?: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
        style={{ '--tw-ring-color': 'var(--brand-color)' } as React.CSSProperties}
      />
    </div>
  )
}

// ─── Login-Id screen ─────────────────────────────────────────────────────────

function LoginIdScreen({ brand, errors }: { brand: BrandConfig; errors: string[] }) {
  const [loading, setLoading] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>(errors)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setLocalErrors([])

    const fd = new FormData(e.currentTarget)
    const username = (fd.get('username') as string)?.trim()

    try {
      const { LoginId } = await import('@auth0/auth0-acul-js')
      const sdk = new LoginId()
      await sdk.login({ username })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'An error occurred'])
      setLoading(false)
    }
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-6">Sign in to your account</h2>
      <ErrorList errors={localErrors} />
      <form onSubmit={handleSubmit}>
        <Field id="username" label="Email address" type="email" autoComplete="email username" />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-60"
          style={{ backgroundColor: brand.color, color: brand.textColor }}
        >
          {loading ? 'Continuing…' : 'Continue'}
        </button>
      </form>
      <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
        <SignupLink brand={brand} />
        <ForgotPasswordLink brand={brand} />
      </div>
    </BrandedShell>
  )
}

// ─── Login-Password screen ───────────────────────────────────────────────────

function LoginPasswordScreen({
  brand,
  email,
  errors,
}: {
  brand: BrandConfig
  email: string
  errors: string[]
}) {
  const [loading, setLoading] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>(errors)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setLocalErrors([])

    const fd = new FormData(e.currentTarget)
    const password = fd.get('password') as string

    try {
      const { LoginPassword } = await import('@auth0/auth0-acul-js')
      const sdk = new LoginPassword()
      await sdk.login({ password, username: email })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'An error occurred'])
      setLoading(false)
    }
  }

  function goBack() {
    history.back()
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-1">Enter your password</h2>
      <p className="text-center text-xs text-gray-500 mb-6">
        {email && <><span className="font-medium text-gray-700">{email}</span> · </>}
        <button onClick={goBack} className="underline hover:no-underline">change</button>
      </p>
      <ErrorList errors={localErrors} />
      <form onSubmit={handleSubmit}>
        <Field id="password" label="Password" type="password" autoComplete="current-password" />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-60"
          style={{ backgroundColor: brand.color, color: brand.textColor }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
        <SignupLink brand={brand} />
        <ForgotPasswordLink brand={brand} />
      </div>
    </BrandedShell>
  )
}

// ─── Helper links ─────────────────────────────────────────────────────────────

function SignupLink({ brand }: { brand: BrandConfig }) {
  async function handleSignup() {
    try {
      const { LoginId } = await import('@auth0/auth0-acul-js')
      const sdk = new LoginId()
      const link = sdk.screen.signupLink
      if (link) window.location.href = link
    } catch {
      // silently ignore — signup link may not be available on all screens
    }
  }
  return (
    <span>
      No account?{' '}
      <button onClick={handleSignup} className="underline hover:no-underline font-medium" style={{ color: brand.color }}>
        Sign up
      </button>
    </span>
  )
}

function ForgotPasswordLink({ brand }: { brand: BrandConfig }) {
  async function handleForgot() {
    try {
      const { LoginPassword } = await import('@auth0/auth0-acul-js')
      const sdk = new LoginPassword()
      const link = sdk.screen.resetPasswordLink
      if (link) window.location.href = link
    } catch {
      // silently ignore
    }
  }
  return (
    <button onClick={handleForgot} className="underline hover:no-underline" style={{ color: brand.color }}>
      Forgot password?
    </button>
  )
}

// ─── Root page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [screenState, setScreenState] = useState<ScreenState>({ phase: 'loading' })
  const [brand, setBrand] = useState<BrandConfig>(getBrandByOrgName(null))

  useEffect(() => {
    const ctx = (window as any).universal_login_context as UniversalLoginContext | undefined

    // Resolve brand from org name
    const orgName = ctx?.organization?.name
    setBrand(getBrandByOrgName(orgName))

    const screenName = ctx?.screen?.name
    const txErrors = ctx?.transaction?.errors?.map(e => e.message) ?? []

    if (!screenName) {
      // Dev mode: no Auth0 context — show login-id form so the page renders
      setScreenState({ phase: 'login-id', errors: [] })
      return
    }

    if (screenName === 'login-id') {
      setScreenState({ phase: 'login-id', errors: txErrors })
    } else if (screenName === 'login-password') {
      // Pre-fill identifier from untrusted_data if available
      const untrusted = (ctx as any)?.untrusted_data?.submitted_form_data
      const email = untrusted?.username ?? ''
      setScreenState({ phase: 'login-password', email, errors: txErrors })
    } else {
      setScreenState({ phase: 'unsupported', screenName })
    }
  }, [])

  if (screenState.phase === 'loading') {
    return (
      <BrandedShell brand={brand}>
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: brand.color }} />
        </div>
      </BrandedShell>
    )
  }

  if (screenState.phase === 'login-id') {
    return <LoginIdScreen brand={brand} errors={screenState.errors} />
  }

  if (screenState.phase === 'login-password') {
    return <LoginPasswordScreen brand={brand} email={screenState.email} errors={screenState.errors} />
  }

  if (screenState.phase === 'unsupported') {
    return (
      <BrandedShell brand={brand}>
        <p className="text-sm text-gray-600 text-center">
          Unsupported screen: <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{screenState.screenName}</code>
        </p>
      </BrandedShell>
    )
  }

  return null
}
