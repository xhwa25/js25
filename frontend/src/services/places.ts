import type { Place } from '../types/place'
import { supabase, supabaseConfigError } from './supabase'

export async function getPlaces(): Promise<Place[]> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .order('visit_date', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as Place[]
}
