'use client'

import { useEffect, useState } from 'react'
import { getBrandByOrgName, type BrandConfig } from '@/lib/brands'

type UniversalLoginContext = {
  screen: { name: string }
  organization?: { name: string }
  transaction?: { state: string; errors?: { code: string; message: string }[] }
}

function BrandedShell({ brand, children }: { brand: BrandConfig; children: React.ReactNode }) {
  return (
    <div
      className="min-h-full flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${brand.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: brand.bgPosition ?? 'center',
        backgroundColor: brand.color,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-sm">
        <div className="h-1.5 rounded-t-xl" style={{ backgroundColor: brand.color }} />
        <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-7 pb-5 flex flex-col items-center gap-2" style={{ backgroundColor: brand.color + '12' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base" style={{ backgroundColor: brand.color }}>
              {brand.displayName.charAt(0)}
            </div>
            <h1 className="text-gray-900 font-bold text-lg tracking-tight">{brand.displayName}</h1>
          </div>
          <div className="px-8 py-7">{children}</div>
          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] text-gray-400">Secured by Auth0 · Powered by Okta</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignupIdScreen({ brand, errors }: { brand: BrandConfig; errors: string[] }) {
  const [loading, setLoading] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>(errors)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setLocalErrors([])
    const fd = new FormData(e.currentTarget)
    const email = (fd.get('email') as string)?.trim()
    try {
      const { SignupId } = await import('@auth0/auth0-acul-js')
      const sdk = new SignupId()
      await sdk.signup({ email })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'An error occurred'])
      setLoading(false)
    }
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-6">Create your account</h2>
      {localErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          {localErrors.map((e, i) => <p key={i} className="text-xs text-red-700">{e}</p>)}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
          style={{ backgroundColor: brand.color, color: brand.textColor }}
        >
          {loading ? 'Continuing…' : 'Continue'}
        </button>
      </form>
      <p className="mt-5 text-xs text-center text-gray-500">
        Already have an account?{' '}
        <a href="/login" className="underline font-medium" style={{ color: brand.color }}>Sign in</a>
      </p>
    </BrandedShell>
  )
}

function SignupPasswordScreen({ brand, email, errors }: { brand: BrandConfig; email: string; errors: string[] }) {
  const [loading, setLoading] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>(errors)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setLocalErrors([])
    const fd = new FormData(e.currentTarget)
    const password = fd.get('password') as string
    try {
      const { SignupPassword } = await import('@auth0/auth0-acul-js')
      const sdk = new SignupPassword()
      await sdk.signup({ password })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'An error occurred'])
      setLoading(false)
    }
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-1">Choose a password</h2>
      {email && <p className="text-center text-xs text-gray-500 mb-6">{email}</p>}
      {localErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          {localErrors.map((e, i) => <p key={i} className="text-xs text-red-700">{e}</p>)}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
          style={{ backgroundColor: brand.color, color: brand.textColor }}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </BrandedShell>
  )
}

export default function SignupPage() {
  const [screenName, setScreenName] = useState<string | null>(null)
  const [brand, setBrand] = useState<BrandConfig>(getBrandByOrgName(null))
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const ctx = (window as any).universal_login_context as UniversalLoginContext | undefined
    setBrand(getBrandByOrgName(ctx?.organization?.name))
    setScreenName(ctx?.screen?.name ?? 'signup-id')
    setErrors(ctx?.transaction?.errors?.map(e => e.message) ?? [])
    const untrusted = (ctx as any)?.untrusted_data?.submitted_form_data
    setEmail(untrusted?.email ?? '')
  }, [])

  if (!screenName) return null
  if (screenName === 'signup-id') return <SignupIdScreen brand={brand} errors={errors} />
  if (screenName === 'signup-password') return <SignupPasswordScreen brand={brand} email={email} errors={errors} />

  return (
    <BrandedShell brand={brand}>
      <p className="text-sm text-gray-600 text-center">
        Screen <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{screenName}</code>
      </p>
    </BrandedShell>
  )
}
