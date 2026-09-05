'use client'

import { useEffect, useState } from 'react'
import { getBrandByOrgName, type BrandConfig } from '@/lib/brands'

export default function ErrorPage() {
  const [brand, setBrand] = useState<BrandConfig>(getBrandByOrgName(null))
  const [errorDesc, setErrorDesc] = useState('An authentication error occurred.')

  useEffect(() => {
    const ctx = (window as any).universal_login_context as any
    setBrand(getBrandByOrgName(ctx?.organization?.name))

    // Parse error description from URL params (Auth0 passes these for error screens)
    const params = new URLSearchParams(window.location.search)
    const desc = params.get('error_description') ?? params.get('message') ?? 'An authentication error occurred.'
    setErrorDesc(desc)
  }, [])

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
        <div className="h-1.5 rounded-t-xl bg-red-500" />
        <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-7 pb-5 flex flex-col items-center gap-2" style={{ backgroundColor: '#fef2f2' }}>
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-lg font-black">!</div>
            <h1 className="text-gray-900 font-bold text-lg tracking-tight">Authentication Error</h1>
          </div>
          <div className="px-8 py-7">
            <p className="text-sm text-gray-600 text-center leading-relaxed">{errorDesc}</p>
            <div className="mt-6">
              <a
                href="/login"
                className="block w-full py-2.5 rounded-lg font-semibold text-sm text-center"
                style={{ backgroundColor: brand.color, color: brand.textColor }}
              >
                Return to Sign In
              </a>
            </div>
          </div>
          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] text-gray-400">Secured by Auth0 · Powered by Okta</p>
          </div>
        </div>
      </div>
    </div>
  )
}
