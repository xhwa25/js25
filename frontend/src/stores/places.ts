import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getPlaces, type PlaceFilters } from '../services/places'
import type { Place, PlaceCategory } from '../types/place'

export const usePlacesStore = defineStore('places', () => {
  const places = ref<Place[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const search = ref('')
  const category = ref<PlaceCategory | ''>('')
  const continent = ref('')
  const year = ref<number | null>(null)
  let requestId = 0

  async function fetchPlaces() {
    const currentRequestId = ++requestId
    loading.value = true
    error.value = null

    const filters: PlaceFilters = {
      search: search.value,
      category: category.value || undefined,
      continent: continent.value || undefined,
      year: year.value,
    }

    try {
      const nextPlaces = await getPlaces(filters)
      if (currentRequestId === requestId) {
        places.value = nextPlaces
      }
    } catch {
      if (currentRequestId === requestId) {
        error.value = 'Unable to load places.'
      }
    } finally {
      if (currentRequestId === requestId) {
        loading.value = false
      }
    }
  }

  function setSearch(value: string) {
    search.value = value
  }

  function setCategory(value: PlaceCategory | '') {
    category.value = value
  }

  function setContinent(value: string) {
    continent.value = value
  }

  function setYear(value: number | null) {
    year.value = value
  }

  function clearFilters() {
    search.value = ''
    category.value = ''
    continent.value = ''
    year.value = null
  }

  return {
    places,
    loading,
    error,
    search,
    category,
    continent,
    year,
    fetchPlaces,
    setSearch,
    setCategory,
    setContinent,
    setYear,
    clearFilters,
  }
})
