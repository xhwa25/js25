<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import PlaceList from '../components/PlaceList.vue'
import { getPlaces } from '../services/places'
import { useFavoritesStore } from '../stores/favorites'
import { useLanguageStore } from '../stores/language'
import type { Place } from '../types/place'

const favoritesStore = useFavoritesStore()
const languageStore = useLanguageStore()
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
    error.value = languageStore.t('unableLoadSaved')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="saved-view" aria-labelledby="saved-title">
    <p class="eyebrow">{{ languageStore.t('yourCollection') }}</p>
    <h1 id="saved-title">{{ languageStore.t('savedPlaces') }}</h1>

    <p v-if="loading" class="placeholder-copy" aria-live="polite">{{ languageStore.t('loadingSaved') }}</p>

    <p v-else-if="error" class="placeholder-copy" role="alert">{{ error }}</p>

    <p v-else-if="savedPlaces.length === 0" class="placeholder-copy">
      {{ languageStore.t('noSaved') }}
    </p>

    <PlaceList v-else :places="savedPlaces" />
  </section>
</template>
