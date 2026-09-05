import { redirect } from 'next/navigation'

// Root path is not used by Auth0 ACUL — screens are at /login, /mfa, /signup, /error
export default function Root() {
  redirect('/login')
}
