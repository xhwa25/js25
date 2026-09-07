import { defineStore } from 'pinia'
import { ref } from 'vue'

const FAVORITES_STORAGE_KEY = 'star-trails-favorites'

function readStoredFavoriteIds(): number[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')

    if (!Array.isArray(stored)) {
      return []
    }

    return [...new Set(stored.filter((id): id is number => Number.isInteger(id) && id > 0))]
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref<number[]>(readStoredFavoriteIds())

  function persist() {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds.value))
      } catch {
        // Storage can be unavailable in privacy-restricted browser contexts.
      }
    }
  }

  function isFavorite(placeId: number): boolean {
    return favoriteIds.value.includes(placeId)
  }

  function addFavorite(placeId: number) {
    if (!isFavorite(placeId)) {
      favoriteIds.value.push(placeId)
      persist()
    }
  }

  function removeFavorite(placeId: number) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== placeId)
    persist()
  }

  function toggleFavorite(placeId: number) {
    if (isFavorite(placeId)) {
      removeFavorite(placeId)
    } else {
      addFavorite(placeId)
    }
  }

  return {
    favoriteIds,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
})
