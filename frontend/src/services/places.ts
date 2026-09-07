import type { Place } from '../types/place'
import { supabase, supabaseConfigError } from './supabase'

export interface PlaceFilters {
  search?: string
  category?: string
  continent?: string
  year?: number | null
}

function escapeSearchTerm(value: string): string {
  return value.replace(/[\\%_(),]/g, '\\$&')
}

export async function getPlaces(filters: PlaceFilters = {}): Promise<Place[]> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase is not configured.')
  }

  let query = supabase.from('places').select('*')

  if (filters.category) {
    query = query.ilike('category', filters.category)
  }

  if (filters.continent) {
    query = query.ilike('continent', filters.continent)
  }

  if (filters.year) {
    query = query.eq('visit_year', filters.year)
  }

  if (filters.search?.trim()) {
    const term = escapeSearchTerm(filters.search.trim())
    query = query.or(`name.ilike.%${term}%,city.ilike.%${term}%,country.ilike.%${term}%`)
  }

  const { data, error } = await query.order('visit_year', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as Place[]
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
