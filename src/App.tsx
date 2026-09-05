import { getBrandByOrgName /*, getBrandByClientName */ } from './lib/brands'
import { LoginIdScreen } from './screens/LoginId'
import { LoginPasswordScreen } from './screens/LoginPassword'
import { OtpScreen } from './screens/MfaOtp'
import { SmsScreen } from './screens/MfaSms'
import { SignupIdScreen } from './screens/SignupId'
import { SignupPasswordScreen } from './screens/SignupPassword'

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

export function App() {
  const ctx = window.universal_login_context
  const screenName = ctx?.screen?.name
  // To switch branding to client-app-driven: comment the org line, uncomment the client line.
  // client.name matches the Auth0 Application Name exactly (Dashboard → Applications).
  // Note: client_id is not exposed in universal_login_context — client.name is the key.
  const brand = getBrandByOrgName(ctx?.organization?.name)
  // const brand = getBrandByClientName(ctx?.client?.name)
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
    default:
      return <LoginIdScreen brand={brand} errors={[]} />
  }
}
