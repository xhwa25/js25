import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getPlaces } from '../services/places'
import type { Place } from '../types/place'

export const usePlacesStore = defineStore('places', () => {
  const places = ref<Place[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPlaces() {
    if (loading.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      places.value = await getPlaces()
    } catch {
      error.value = 'Unable to load places.'
    } finally {
      loading.value = false
    }
  }

  return { places, loading, error, fetchPlaces }
})
