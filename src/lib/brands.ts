export type BrandConfig = {
  slug: string
  displayName: string
  color: string
  textColor: string
  bgImage: string
  bgPosition?: string
  logoUrl?: string
}

// To key branding off client app instead of org, swap the lookup in App.tsx
// (comment getBrandByOrgName line, uncomment getBrandByClientName line) and
// populate this map with your Auth0 application names exactly as they appear
// in Dashboard → Applications → Application Name.
//
// export const BRAND_BY_CLIENT_NAME: Record<string, BrandConfig> = {
//   'HND Partner Portal': { slug: 'hnd', displayName: 'HND Portal', color: '#E40521', textColor: '#fff', bgImage: 'https://portal.auth.tamirsa.com/brands/hnd.png', bgPosition: 'center' },
//   'SPS Partner Portal': { slug: 'sps', displayName: 'SPS Portal', color: '#5F8B3E', textColor: '#fff', bgImage: 'https://portal.auth.tamirsa.com/brands/sps.png', bgPosition: 'left center' },
//   'CTP Partner Portal': { slug: 'ctp', displayName: 'CTP Portal', color: '#FFCD11', textColor: '#000', bgImage: 'https://portal.auth.tamirsa.com/brands/ctp.png', bgPosition: 'center' },
//   'ECL Partner Portal': { slug: 'ecl', displayName: 'ECL Portal', color: '#003591', textColor: '#fff', bgImage: 'https://portal.auth.tamirsa.com/brands/ecl.png', bgPosition: 'center' },
// }
//
// export function getBrandByClientName(clientName: string | null | undefined): BrandConfig {
//   if (!clientName) return DEFAULT_BRAND
//   return BRAND_BY_CLIENT_NAME[clientName] ?? DEFAULT_BRAND
// }

export const BRAND_BY_ORG_NAME: Record<string, BrandConfig> = {
  'red-hnd': {
    slug: 'hnd',
    displayName: 'HND Portal',
    color: '#E40521',
    textColor: '#fff',
    bgImage: 'https://portal.auth.tamirsa.com/brands/hnd.png',
    bgPosition: 'center',
    logoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/500px-Honda.svg.png',
  },
  'green-sps': {
    slug: 'sps',
    displayName: 'SPS Portal',
    color: '#5F8B3E',
    textColor: '#fff',
    bgImage: 'https://portal.auth.tamirsa.com/brands/sps.png',
    bgPosition: 'left center',
    logoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Sprouts_Farmers_Market_Logo.png/330px-Sprouts_Farmers_Market_Logo.png',
  },
  'yellow-ctp': {
    slug: 'ctp',
    displayName: 'CTP Portal',
    color: '#FFCD11',
    textColor: '#000',
    bgImage: 'https://portal.auth.tamirsa.com/brands/ctp.png',
    bgPosition: 'center',
    logoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Caterpillar_logo.svg/960px-Caterpillar_logo.svg.png',
  },
  'blue-ecl': {
    slug: 'ecl',
    displayName: 'ECL Portal',
    color: '#003591',
    textColor: '#fff',
    bgImage: 'https://portal.auth.tamirsa.com/brands/ecl.png',
    bgPosition: 'center',
    logoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Ecolab.svg/960px-Ecolab.svg.png',
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
