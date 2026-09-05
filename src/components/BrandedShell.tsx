import type { BrandConfig } from '../lib/brands'

export function BrandedShell({ brand, children }: { brand: BrandConfig; children: React.ReactNode }) {
  return (
    <div
      className="min-h-full flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${brand.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: brand.bgPosition ?? 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: brand.color,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-sm">
        <div className="h-1.5 rounded-t-xl" style={{ backgroundColor: brand.color }} />
        <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden">
          <div
            className="px-8 pt-7 pb-5 flex flex-col items-center gap-2"
            style={{ backgroundColor: brand.color + '12' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base"
              style={{ backgroundColor: brand.color }}
            >
              {brand.displayName.charAt(0)}
            </div>
            <h1 className="text-gray-900 font-bold text-lg tracking-tight">{brand.displayName}</h1>
          </div>
          <div className="px-8 py-7">{children}</div>
          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] text-gray-400">Secured by Auth0 &middot; Powered by Okta</p>
          </div>
        </div>
      </div>
    </div>
  )
}
