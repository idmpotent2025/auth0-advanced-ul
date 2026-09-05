import { useState } from 'react'
import { SignupId } from '@auth0/auth0-acul-js'
import type { BrandConfig } from '../lib/brands'
import { BrandedShell } from '../components/BrandedShell'
import { ErrorList } from '../components/ErrorList'

export function SignupIdScreen({ brand, errors }: { brand: BrandConfig; errors: string[] }) {
  const [loading, setLoading] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>(errors)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setLocalErrors([])
    const email = (new FormData(e.currentTarget).get('email') as string)?.trim()
    try {
      await new SignupId().signup({ email })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'An error occurred'])
      setLoading(false)
    }
  }

  function handleLogin() {
    try {
      const link = (new SignupId().screen as any).loginLink
      if (link) window.location.href = link
    } catch { /* not available */ }
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-6">Create your account</h2>
      <ErrorList errors={localErrors} />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
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
          {loading ? 'Continuing…' : 'Continue'}
        </button>
      </form>
      <p className="mt-5 text-xs text-center text-gray-500">
        Already have an account?{' '}
        <button
          onClick={handleLogin}
          className="underline font-medium"
          style={{ color: brand.color }}
        >
          Sign in
        </button>
      </p>
    </BrandedShell>
  )
}
