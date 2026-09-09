<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import FavoriteButton from '../components/FavoriteButton.vue'
import PlacesMap from '../components/PlacesMap.vue'
import { usePlacesStore } from '../stores/places'
import { localizePlaceCategory } from '../utils/placeLocalization'
import type { Place } from '../types/place'
import { useLanguageStore } from '../stores/language'
import { getPlaceName, getPlaceNameSubtitle } from '../utils/placeName'

const placesStore = usePlacesStore()
const { places, loading, error } = storeToRefs(placesStore)
const selectedPlace = ref<Place | null>(null)
const languageStore = useLanguageStore()

onMounted(() => {
  if (!places.value.length && !loading.value) {
    void placesStore.fetchPlaces()
  }
})

watch(places, (nextPlaces) => {
  if (selectedPlace.value && !nextPlaces.some((place) => place.id === selectedPlace.value?.id)) {
    selectedPlace.value = null
  }
})
</script>

<template>
  <section class="map-view" aria-labelledby="map-title">
    <header class="map-view-heading">
      <div>
        <p class="eyebrow">{{ languageStore.t('worldPlotted') }}</p>
        <h1 id="map-title">{{ languageStore.t('map') }}</h1>
        <p class="hero-copy">{{ languageStore.t('mapIntro') }}</p>
      </div>
      <span class="archive-count">{{ places.length }} {{ languageStore.t('placesInArchive') }}</span>
    </header>

    <p v-if="loading" class="state-panel" aria-live="polite">{{ languageStore.t('loadingGlobe') }}</p>
    <p v-else-if="error" class="state-panel" role="alert">{{ error }}</p>
    <div v-else class="map-stage" :class="{ 'has-selection': selectedPlace }">
      <aside v-if="selectedPlace" class="map-place-panel" aria-label="Selected place">
        <div class="map-place-panel-header">
          <p class="eyebrow">{{ languageStore.t('selectedLocation') }}</p>
          <button type="button" class="map-place-close" :aria-label="languageStore.t('closePlaceDetails')" @click="selectedPlace = null">
            ×
          </button>
        </div>

        <img
          v-if="selectedPlace.image_url"
          class="map-place-image"
          :src="selectedPlace.image_url"
          :alt="getPlaceName(selectedPlace, languageStore.locale)"
        />
        <div v-else class="map-place-image map-place-image-placeholder">{{ languageStore.t('noImage') }}</div>

        <div class="map-place-content">
          <div class="map-place-title-row">
            <div>
              <h2>{{ getPlaceName(selectedPlace, languageStore.locale) }}</h2>
              <p
                v-if="getPlaceNameSubtitle(selectedPlace, languageStore.locale)"
                class="place-name-subtitle"
              >
                {{ getPlaceNameSubtitle(selectedPlace, languageStore.locale) }}
              </p>
            </div>
            <FavoriteButton :place-id="selectedPlace.id" />
          </div>
          <span class="map-place-category">{{ localizePlaceCategory(selectedPlace.category, languageStore.locale) }}</span>
          <p class="map-place-location">{{ selectedPlace.city }}, {{ selectedPlace.country }}</p>
          <p v-if="selectedPlace.address" class="map-place-fact">{{ selectedPlace.address }}</p>
          <RouterLink
            class="map-place-detail-link"
            :to="{ name: 'place-detail', params: { id: selectedPlace.id } }"
          >
            {{ languageStore.t('viewFullDetails') }}
          </RouterLink>
        </div>
      </aside>

      <PlacesMap :places="places" @select="selectedPlace = $event" />
    </div>
  </section>
</template>
