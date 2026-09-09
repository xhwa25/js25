export const PLACE_CATEGORIES = [
  'RESTAURANT',
  'CAFE',
  'ATTRACTION',
  'OTHER',
] as const

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number]

export interface Place {
  id: number
  name: string | null
  english_name: string | null
  korean_name: string | null
  description: string | null
  category: PlaceCategory
  continent: string
  country: string
  city: string
  address: string | null
  latitude: number
  longitude: number
  map_url: string | null
  visit_year: number
  image_url: string | null
  source_url?: string | null
  created_at: string
  updated_at: string
}
