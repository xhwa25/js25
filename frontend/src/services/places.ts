import type { Place, PlaceCategory } from '../types/place'
import { supabase, supabaseConfigError } from './supabase'

export interface PlaceFilters {
  search?: string
  categories?: PlaceCategory[]
  countries?: string[]
  cities?: string[]
  years?: number[]
}

export interface PlaceFilterOptions {
  countries: string[]
  cities: string[]
  years: number[]
}

function escapeSearchTerm(value: string): string {
  return value.replace(/[\\%_(),]/g, '\\$&')
}

export async function getPlaces(filters: PlaceFilters = {}): Promise<Place[]> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase is not configured.')
  }

  let query = supabase.from('places').select('*')

  if (filters.categories?.length) {
    query = query.in('category', filters.categories)
  }

  if (filters.countries?.length) {
    query = query.in('country', filters.countries)
  }

  if (filters.cities?.length) {
    query = query.in('city', filters.cities)
  }

  if (filters.years?.length) {
    query = query.in('visit_year', filters.years)
  }

  if (filters.search?.trim()) {
    const term = escapeSearchTerm(filters.search.trim())
    query = query.or(
      `name.ilike.%${term}%,english_name.ilike.%${term}%,korean_name.ilike.%${term}%,city.ilike.%${term}%,country.ilike.%${term}%`,
    )
  }

  const { data, error } = await query.order('visit_year', {
    ascending: false,
    nullsFirst: false,
  })

  if (error) {
    throw error
  }

  return (data ?? []) as Place[]
}

export async function getPlaceFilterOptions(): Promise<PlaceFilterOptions> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase is not configured.')
  }

  const { data, error } = await supabase.from('places').select('country, city, visit_year')

  if (error) {
    throw error
  }

  const rows = data ?? []
  const cityCounts = rows.reduce((counts, row) => {
    if (row.city) {
      counts.set(row.city, (counts.get(row.city) ?? 0) + 1)
    }
    return counts
  }, new Map<string, number>())

  return {
    countries: [...new Set(rows.map((row) => row.country).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    ),
    cities: [...cityCounts.entries()]
      .filter(([, count]) => count > 3)
      .map(([city]) => city)
      .sort((a, b) => a.localeCompare(b)),
    years: [...new Set(rows.map((row) => row.visit_year).filter(Number.isFinite))].sort(
      (a, b) => b - a,
    ),
  }
}

export async function getPlaceById(id: number): Promise<Place | null> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as Place | null) ?? null
}
