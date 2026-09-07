<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import PlaceList from '../components/PlaceList.vue'
import { getPlaces } from '../services/places'
import { useFavoritesStore } from '../stores/favorites'
import type { Place } from '../types/place'

const favoritesStore = useFavoritesStore()
const allPlaces = ref<Place[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const savedPlaces = computed(() =>
  allPlaces.value.filter((place) => favoritesStore.isFavorite(place.id)),
)

onMounted(async () => {
  try {
    allPlaces.value = await getPlaces()
  } catch {
    error.value = 'Unable to load saved places.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="saved-view" aria-labelledby="saved-title">
    <p class="eyebrow">Your collection</p>
    <h1 id="saved-title">Saved places</h1>

    <p v-if="loading" class="placeholder-copy" aria-live="polite">Loading saved places...</p>

    <p v-else-if="error" class="placeholder-copy" role="alert">{{ error }}</p>

    <p v-else-if="savedPlaces.length === 0" class="placeholder-copy">
      You have not saved any places yet.
    </p>

    <PlaceList v-else :places="savedPlaces" />
  </section>
</template>
