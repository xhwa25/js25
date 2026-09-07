export const PLACE_CATEGORIES = [
  'RESTAURANT',
  'CAFE',
  'ATTRACTION',
  'SHOPPING',
  'HOTEL',
  'EVENT',
  'OTHER',
] as const

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number]

export interface Place {
  id: number
  name: string
  description: string | null
  category: PlaceCategory
  continent: string
  country: string
  city: string
  address: string | null
  latitude: number
  longitude: number
  visit_year: number
  image_url: string | null
  source_url?: string | null
  created_at: string
  updated_at: string
}
