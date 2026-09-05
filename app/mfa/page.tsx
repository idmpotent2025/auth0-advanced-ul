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

function OtpScreen({ brand, errors }: { brand: BrandConfig; errors: string[] }) {
  const [loading, setLoading] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>(errors)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setLocalErrors([])
    const fd = new FormData(e.currentTarget)
    const code = fd.get('code') as string
    try {
      const { MfaOtpChallenge } = await import('@auth0/auth0-acul-js')
      const sdk = new MfaOtpChallenge()
      await sdk.continue({ code })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'Invalid code'])
      setLoading(false)
    }
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-2">Two-factor authentication</h2>
      <p className="text-center text-xs text-gray-500 mb-6">Enter the 6-digit code from your authenticator app</p>
      {localErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          {localErrors.map((e, i) => <p key={i} className="text-xs text-red-700">{e}</p>)}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          required
          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
          style={{ backgroundColor: brand.color, color: brand.textColor }}
        >
          {loading ? 'Verifying…' : 'Verify'}
        </button>
      </form>
    </BrandedShell>
  )
}

function SmsScreen({ brand, errors }: { brand: BrandConfig; errors: string[] }) {
  const [loading, setLoading] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>(errors)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setLocalErrors([])
    const fd = new FormData(e.currentTarget)
    const code = fd.get('code') as string
    try {
      const { MfaSmsChallenge } = await import('@auth0/auth0-acul-js')
      const sdk = new MfaSmsChallenge()
      await sdk.continueMfaSmsChallenge({ code })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'Invalid code'])
      setLoading(false)
    }
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-2">SMS verification</h2>
      <p className="text-center text-xs text-gray-500 mb-6">Enter the code sent to your phone</p>
      {localErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          {localErrors.map((e, i) => <p key={i} className="text-xs text-red-700">{e}</p>)}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          required
          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
          style={{ backgroundColor: brand.color, color: brand.textColor }}
        >
          {loading ? 'Verifying…' : 'Verify'}
        </button>
      </form>
    </BrandedShell>
  )
}

export default function MfaPage() {
  const [screenName, setScreenName] = useState<string | null>(null)
  const [brand, setBrand] = useState<BrandConfig>(getBrandByOrgName(null))
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const ctx = (window as any).universal_login_context as UniversalLoginContext | undefined
    setBrand(getBrandByOrgName(ctx?.organization?.name))
    setScreenName(ctx?.screen?.name ?? 'mfa-otp-challenge')
    setErrors(ctx?.transaction?.errors?.map(e => e.message) ?? [])
  }, [])

  if (!screenName) return null

  if (screenName === 'mfa-otp-challenge') return <OtpScreen brand={brand} errors={errors} />
  if (screenName === 'mfa-sms-challenge') return <SmsScreen brand={brand} errors={errors} />

  return (
    <BrandedShell brand={brand}>
      <p className="text-sm text-gray-600 text-center">
        MFA screen <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{screenName}</code> — not yet implemented.
      </p>
    </BrandedShell>
  )
}
