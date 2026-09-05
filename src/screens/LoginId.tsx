import { useState } from 'react'
import { LoginId } from '@auth0/auth0-acul-js'
import type { BrandConfig } from '../lib/brands'
import { BrandedShell } from '../components/BrandedShell'
import { ErrorList } from '../components/ErrorList'
import { Field } from '../components/Field'

export function LoginIdScreen({ brand, errors }: { brand: BrandConfig; errors: string[] }) {
  const [loading, setLoading] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>(errors)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setLocalErrors([])
    const username = (new FormData(e.currentTarget).get('username') as string)?.trim()
    try {
      await new LoginId().login({ username })
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
      </div>
    </BrandedShell>
  )
}

function SignupLink({ brand }: { brand: BrandConfig }) {
  function handleSignup() {
    try {
      const link = new LoginId().screen.signupLink
      if (link) window.location.href = link
    } catch { /* not available on this screen */ }
  }
  return (
    <span>
      No account?{' '}
      <button
        onClick={handleSignup}
        className="underline hover:no-underline font-medium"
        style={{ color: brand.color }}
      >
        Sign up
      </button>
    </span>
  )
}
