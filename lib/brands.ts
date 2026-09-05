export type BrandConfig = {
  slug: string
  displayName: string
  color: string
  textColor: string
  bgImage: string
  bgPosition?: string
}

// Keyed by Auth0 organization name (slug) — must match what you set in Auth0 Dashboard
export const BRAND_BY_ORG_NAME: Record<string, BrandConfig> = {
  hnd: {
    slug: 'hnd',
    displayName: 'HND Portal',
    color: '#E40521',
    textColor: '#fff',
    bgImage: 'https://portal.auth.tamirsa.com/brands/hnd.png',
    bgPosition: 'center',
  },
  sps: {
    slug: 'sps',
    displayName: 'SPS Portal',
    color: '#5F8B3E',
    textColor: '#fff',
    bgImage: 'https://portal.auth.tamirsa.com/brands/sps.png',
    bgPosition: 'left center',
  },
  ctp: {
    slug: 'ctp',
    displayName: 'CTP Portal',
    color: '#FFCD11',
    textColor: '#000',
    bgImage: 'https://portal.auth.tamirsa.com/brands/ctp.png',
    bgPosition: 'center',
  },
  ecl: {
    slug: 'ecl',
    displayName: 'ECL Portal',
    color: '#003591',
    textColor: '#fff',
    bgImage: 'https://portal.auth.tamirsa.com/brands/ecl.png',
    bgPosition: 'center',
  },
}

const DEFAULT_BRAND: BrandConfig = {
  slug: 'default',
  displayName: 'Partner Portal',
  color: '#1d4ed8',
  textColor: '#fff',
  bgImage: 'https://portal.auth.tamirsa.com/brands/default.webp',
  bgPosition: 'center',
}

export function getBrandByOrgName(orgName: string | null | undefined): BrandConfig {
  if (!orgName) return DEFAULT_BRAND
  return BRAND_BY_ORG_NAME[orgName.toLowerCase()] ?? DEFAULT_BRAND
}
