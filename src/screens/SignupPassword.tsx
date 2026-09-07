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
    const fd = new FormData(e.currentTarget)
    const password = fd.get('password') as string
    const given_name = (fd.get('given_name') as string)?.trim()
    const family_name = (fd.get('family_name') as string)?.trim()
    const zipcode = (fd.get('zipcode') as string)?.trim()
    const consent = fd.get('consent') === 'on'
    // Custom fields are passed via the SDK's index signature and become available
    // in Auth0's pre-user-registration Action under event.request.body
    try {
      await new SignupPassword().signup({ password, given_name, family_name, zipcode, consent })
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
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label htmlFor="given_name" className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
            <input id="given_name" name="given_name" type="text" autoComplete="given-name" required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent" />
          </div>
          <div>
            <label htmlFor="family_name" className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
            <input id="family_name" name="family_name" type="text" autoComplete="family-name" required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1.5">Zip / Postal code</label>
          <input id="zipcode" name="zipcode" type="text" autoComplete="postal-code" required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent" />
        </div>
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
        <div className="mb-5 flex items-start gap-2.5">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0"
            style={{ accentColor: brand.color }}
          />
          <label htmlFor="consent" className="text-xs text-gray-500 leading-relaxed">
            I agree to the{' '}
            <a href="#" className="underline" style={{ color: brand.color }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline" style={{ color: brand.color }}>Privacy Policy</a>,
            and consent to my data being processed for account management.
          </label>
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
