<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import FilterBar from '../components/FilterBar.vue'
import PlaceList from '../components/PlaceList.vue'
import SearchBar from '../components/SearchBar.vue'
import { usePlacesStore } from '../stores/places'
import type { PlaceCategory } from '../types/place'

const placesStore = usePlacesStore()
const { places, loading, error } = storeToRefs(placesStore)
const { search, category, continent, year } = storeToRefs(placesStore)

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
        <p class="eyebrow">A living travel archive</p>
        <h1>Locations</h1>
        <p class="hero-copy">
          Follow the places behind the photos. Search the archive or narrow it down by category,
          region, and year.
        </p>
      </div>
      <p class="archive-count">{{ places.length }} places in the archive</p>
    </div>

    <div class="locations-layout">
      <aside class="locations-sidebar" aria-label="Search and filter places">
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
      </aside>

      <div class="locations-results">
        <div v-if="loading" class="explore-loading" aria-live="polite" aria-label="Loading places">
          <div class="loading-list">
            <div v-for="index in 3" :key="index" class="place-card-skeleton" aria-hidden="true">
              <span class="skeleton-media"></span>
              <span class="skeleton-copy">
                <span class="skeleton-line skeleton-line-title"></span>
                <span class="skeleton-line"></span>
                <span class="skeleton-line skeleton-line-short"></span>
              </span>
            </div>
          </div>
        </div>

        <div v-else-if="error" class="state-panel" role="alert">
          <p class="state-label">Could not load places</p>
          <p>{{ error }}</p>
          <button type="button" class="state-action" @click="refreshPlaces">Try again</button>
        </div>

        <div v-else-if="places.length === 0" class="state-panel" aria-live="polite">
          <p class="state-label">No places match these filters</p>
          <p>Try a different search or clear the filters to see the full collection.</p>
          <button type="button" class="state-action" @click="clearFilters">Clear filters</button>
        </div>

        <section v-else class="locations-list-panel" aria-label="All places">
          <header class="locations-list-header">
            <h2>All places</h2>
            <span>Latest visits first</span>
          </header>
          <PlaceList :places="places" />
        </section>
      </div>
    </div>
  </section>
</template>
