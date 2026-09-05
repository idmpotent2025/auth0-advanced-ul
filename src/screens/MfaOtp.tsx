import { useState } from 'react'
import { MfaOtpChallenge } from '@auth0/auth0-acul-js'
import type { BrandConfig } from '../lib/brands'
import { BrandedShell } from '../components/BrandedShell'
import { ErrorList } from '../components/ErrorList'

export function OtpScreen({ brand, errors }: { brand: BrandConfig; errors: string[] }) {
  const [loading, setLoading] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>(errors)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setLocalErrors([])
    const code = new FormData(e.currentTarget).get('code') as string
    try {
      await new MfaOtpChallenge().continue({ code })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'Invalid code'])
      setLoading(false)
    }
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-2">Two-factor authentication</h2>
      <p className="text-center text-xs text-gray-500 mb-6">Enter the 6-digit code from your authenticator app</p>
      <ErrorList errors={localErrors} />
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
