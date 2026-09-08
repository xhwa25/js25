<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import FilterBar from '../components/FilterBar.vue'
import PlaceList from '../components/PlaceList.vue'
import SearchBar from '../components/SearchBar.vue'
import { usePlacesStore } from '../stores/places'
import { useLanguageStore } from '../stores/language'
import type { PlaceCategory } from '../types/place'

const placesStore = usePlacesStore()
const { places, loading, error } = storeToRefs(placesStore)
const { search, category, continent, year } = storeToRefs(placesStore)
const languageStore = useLanguageStore()

onMounted(() => {
  void placesStore.fetchPlaces()
})

function refreshPlaces() {
  void placesStore.fetchPlaces()
}

function updateSearch(value: string) {
  placesStore.setSearch(value)
  refreshPlaces()
}

function updateCategory(value: PlaceCategory | '') {
  placesStore.setCategory(value)
  refreshPlaces()
}

function updateContinent(value: string) {
  placesStore.setContinent(value)
  refreshPlaces()
}

function updateYear(value: number | null) {
  placesStore.setYear(value)
  refreshPlaces()
}

function clearFilters() {
  placesStore.clearFilters()
  refreshPlaces()
}
</script>

<template>
  <section class="explore-view">
    <div class="explore-hero">
      <div>
        <p class="eyebrow">{{ languageStore.t('archiveEyebrow') }}</p>
        <h1>{{ languageStore.t('locationsHeading') }}</h1>
        <p class="hero-copy">
          {{ languageStore.t('locationsIntro') }}
        </p>
      </div>
      <p class="archive-count">{{ places.length }} {{ languageStore.t('placesInArchive') }}</p>
    </div>

    <div class="places-browser">
      <section class="places-sticky-controls" :aria-label="languageStore.t('placeFilters')">
        <SearchBar :model-value="search" @update:model-value="updateSearch" />
        <FilterBar
          :category="category"
          :continent="continent"
          :year="year"
          @update:category="updateCategory"
          @update:continent="updateContinent"
          @update:year="updateYear"
          @clear="clearFilters"
        />
        <div class="places-list-toolbar">
          <div>
            <h2>{{ languageStore.t('allPlaces') }}</h2>
            <span>{{ places.length }} {{ languageStore.t('placesCount') }}</span>
          </div>
          <span>{{ languageStore.t('latestVisits') }}</span>
        </div>
      </section>

      <div v-if="loading" class="explore-loading places-grid" aria-live="polite" aria-label="Loading places">
          <div v-for="index in 6" :key="index" class="place-card-skeleton" aria-hidden="true">
          <span class="skeleton-media"></span>
          <span class="skeleton-copy">
            <span class="skeleton-line skeleton-line-title"></span>
            <span class="skeleton-line"></span>
            <span class="skeleton-line skeleton-line-short"></span>
          </span>
        </div>
      </div>

      <div v-else-if="error" class="state-panel" role="alert">
        <p class="state-label">{{ languageStore.t('couldNotLoad') }}</p>
        <p>{{ error }}</p>
        <button type="button" class="state-action" @click="refreshPlaces">{{ languageStore.t('tryAgain') }}</button>
      </div>

      <div v-else-if="places.length === 0" class="state-panel" aria-live="polite">
        <p class="state-label">{{ languageStore.t('noResults') }}</p>
        <p>{{ languageStore.t('noResultsHelp') }}</p>
        <button type="button" class="state-action" @click="clearFilters">{{ languageStore.t('clear') }}</button>
      </div>

      <PlaceList v-else class="places-grid" :places="places" />
    </div>
  </section>
</template>
