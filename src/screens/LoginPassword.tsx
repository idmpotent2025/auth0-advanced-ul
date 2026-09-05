import { useState } from 'react'
import { LoginPassword } from '@auth0/auth0-acul-js'
import type { BrandConfig } from '../lib/brands'
import { BrandedShell } from '../components/BrandedShell'
import { ErrorList } from '../components/ErrorList'
import { Field } from '../components/Field'

export function LoginPasswordScreen({
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
      await new LoginPassword().login({ password, username: email })
    } catch (err: any) {
      setLocalErrors([err?.message ?? 'An error occurred'])
      setLoading(false)
    }
  }

  return (
    <BrandedShell brand={brand}>
      <h2 className="text-center text-gray-800 font-semibold text-base mb-1">Enter your password</h2>
      <p className="text-center text-xs text-gray-500 mb-6">
        {email && <><span className="font-medium text-gray-700">{email}</span> · </>}
        <button onClick={() => history.back()} className="underline hover:no-underline">change</button>
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
        <ForgotPasswordLink brand={brand} />
      </div>
    </BrandedShell>
  )
}

function ForgotPasswordLink({ brand }: { brand: BrandConfig }) {
  function handleForgot() {
    try {
      const link = new LoginPassword().screen.resetPasswordLink
      if (link) window.location.href = link
    } catch { /* not available on this screen */ }
  }
  return (
    <button
      onClick={handleForgot}
      className="underline hover:no-underline"
      style={{ color: brand.color }}
    >
      Forgot password?
    </button>
  )
}
