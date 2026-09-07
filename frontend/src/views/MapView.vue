<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import PlacesMap from '../components/PlacesMap.vue'
import { usePlacesStore } from '../stores/places'

const placesStore = usePlacesStore()
const { places, loading, error } = storeToRefs(placesStore)

onMounted(() => {
  if (!places.value.length && !loading.value) {
    void placesStore.fetchPlaces()
  }
})
</script>

<template>
  <section class="map-view" aria-labelledby="map-title">
    <header class="map-view-heading">
      <div>
        <p class="eyebrow">The world, plotted</p>
        <h1 id="map-title">Map</h1>
        <p class="hero-copy">Move across the globe to see every place in the archive.</p>
      </div>
      <span class="archive-count">{{ places.length }} places in the archive</span>
    </header>

    <p v-if="loading" class="state-panel" aria-live="polite">Loading globe...</p>
    <p v-else-if="error" class="state-panel" role="alert">{{ error }}</p>
    <PlacesMap v-else :places="places" />
  </section>
</template>
