import { getBrandByOrgName /*, getBrandByClientName */ } from './lib/brands'
import { LoginIdScreen } from './screens/LoginId'
import { LoginPasswordScreen } from './screens/LoginPassword'
import { OtpScreen } from './screens/MfaOtp'
import { SmsScreen } from './screens/MfaSms'
import { SignupIdScreen } from './screens/SignupId'
import { SignupPasswordScreen } from './screens/SignupPassword'
import { PasskeyEnrollmentScreen } from './screens/PasskeyEnrollment'

declare global {
  interface Window {
    universal_login_context?: {
      screen: { name: string }
      organization?: { id: string; name: string; display_name: string }
      transaction?: { state: string; errors?: { code: string; message: string }[] }
      client?: { name: string; logo_uri?: string }
      untrusted_data?: { submitted_form_data?: Record<string, string> }
    }
  }
}

const BRAND_STORAGE_KEY = 'acul_org_name'

export function App() {
  const ctx = window.universal_login_context
  const screenName = ctx?.screen?.name
  const orgName = ctx?.organization?.name

  // Auth0 only populates `organization` in universal_login_context during pre-login prompts
  // (login-id, login-password, signup, etc.). Post-login screens such as passkey-enrollment
  // and Actions-triggered prompts run after the auth transaction completes and do NOT receive
  // organization context — so orgName is undefined there and getBrandByOrgName falls back to
  // DEFAULT_BRAND (blue). Fix: persist the org name to localStorage on any pre-login screen
  // where it IS available, then read it back as a fallback on post-login screens.
  let brand = getBrandByOrgName(orgName)
  if (brand.slug === 'default') {
    try {
      const cached = localStorage.getItem(BRAND_STORAGE_KEY)
      if (cached) brand = getBrandByOrgName(cached)
    } catch (_) { /* localStorage unavailable */ }
  } else {
    try { localStorage.setItem(BRAND_STORAGE_KEY, orgName!) } catch (_) { /* noop */ }
  }
  const errors = ctx?.transaction?.errors?.map((e) => e.message) ?? []
  const submitted = ctx?.untrusted_data?.submitted_form_data ?? {}
  const email = submitted.username ?? submitted.email ?? ''

  switch (screenName) {
    case 'login-id':
      return <LoginIdScreen brand={brand} errors={errors} />
    case 'login-password':
      return <LoginPasswordScreen brand={brand} email={email} errors={errors} />
    case 'mfa-otp-challenge':
      return <OtpScreen brand={brand} errors={errors} />
    case 'mfa-sms-challenge':
      return <SmsScreen brand={brand} errors={errors} />
    case 'signup-id':
      return <SignupIdScreen brand={brand} errors={errors} />
    case 'signup-password':
      return <SignupPasswordScreen brand={brand} email={email} errors={errors} />
    case 'passkey-enrollment':
      return <PasskeyEnrollmentScreen brand={brand} errors={errors} />
    case 'passkey-enrollment-local':
      return <PasskeyEnrollmentScreen brand={brand} errors={errors} local />
    default:
      return <LoginIdScreen brand={brand} errors={[]} />
  }
}
