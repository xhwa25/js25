import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getPlaceFilterOptions, getPlaces, type PlaceFilters } from '../services/places'
import type { Place, PlaceCategory } from '../types/place'

export const usePlacesStore = defineStore('places', () => {
  const places = ref<Place[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const search = ref('')
  const categories = ref<PlaceCategory[]>([])
  const countries = ref<string[]>([])
  const cities = ref<string[]>([])
  const years = ref<number[]>([])
  const availableCountries = ref<string[]>([])
  const availableCities = ref<string[]>([])
  const availableYears = ref<number[]>([])
  const filterOptionsLoaded = ref(false)
  let filterOptionsRequest: Promise<void> | null = null
  let requestId = 0

  async function fetchPlaces() {
    const currentRequestId = ++requestId
    loading.value = true
    error.value = null

    const filters: PlaceFilters = {
      search: search.value,
      categories: categories.value,
      countries: countries.value,
      cities: cities.value,
      years: years.value,
    }

    try {
      const nextPlaces = await getPlaces(filters)
      if (currentRequestId === requestId) {
        places.value = nextPlaces
        if (!filterOptionsLoaded.value) {
          availableCountries.value = [
            ...new Set([...availableCountries.value, ...nextPlaces.map((place) => place.country)]),
          ].sort((a, b) => a.localeCompare(b))
          const cityCounts = nextPlaces.reduce((counts, place) => {
            counts.set(place.city, (counts.get(place.city) ?? 0) + 1)
            return counts
          }, new Map<string, number>())
          availableCities.value = [...cityCounts.entries()]
            .filter(([, count]) => count > 3)
            .map(([city]) => city)
            .sort((a, b) => a.localeCompare(b))
          availableYears.value = [
            ...new Set([...availableYears.value, ...nextPlaces.map((place) => place.visit_year)]),
          ].sort((a, b) => b - a)
        }
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

  function setCategories(value: PlaceCategory[]) {
    categories.value = value
  }

  function setCountries(value: string[]) {
    countries.value = value
  }

  function setCities(value: string[]) {
    cities.value = value
  }

  function setYears(value: number[]) {
    years.value = value
  }

  async function fetchFilterOptions() {
    if (filterOptionsLoaded.value) {
      return
    }

    if (!filterOptionsRequest) {
      filterOptionsRequest = getPlaceFilterOptions()
        .then((options) => {
          availableCountries.value = options.countries
          availableCities.value = options.cities
          availableYears.value = options.years
          filterOptionsLoaded.value = true
        })
        .catch(() => {
          // Keep options derived from fetched places if the facet request fails.
        })
        .finally(() => {
          filterOptionsRequest = null
        })
    }

    await filterOptionsRequest
  }

  function clearFilters() {
    search.value = ''
    categories.value = []
    countries.value = []
    cities.value = []
    years.value = []
  }

  return {
    places,
    loading,
    error,
    search,
    categories,
    countries,
    cities,
    years,
    availableCountries,
    availableCities,
    availableYears,
    fetchPlaces,
    fetchFilterOptions,
    setSearch,
    setCategories,
    setCountries,
    setCities,
    setYears,
    clearFilters,
  }
})
