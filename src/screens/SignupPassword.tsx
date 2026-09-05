import { useState } from 'react'
import { SignupPassword } from '@auth0/auth0-acul-js'
import type { BrandConfig } from '../lib/brands'
import { BrandedShell } from '../components/BrandedShell'
import { ErrorList } from '../components/ErrorList'

export function SignupPasswordScreen({
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
    const password = new FormData(e.currentTarget).get('password') as string
    try {
      await new SignupPassword().signup({ password })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'An error occurred'])
      setLoading(false)
    }
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-1">Choose a password</h2>
      {email && <p className="text-center text-xs text-gray-500 mb-6">{email}</p>}
      <ErrorList errors={localErrors} />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-60"
          style={{ backgroundColor: brand.color, color: brand.textColor }}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </BrandedShell>
  )
}
