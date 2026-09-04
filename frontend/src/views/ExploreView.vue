<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { usePlacesStore } from '../stores/places'

const placesStore = usePlacesStore()
const { places, loading, error } = storeToRefs(placesStore)

onMounted(() => {
  void placesStore.fetchPlaces()
})
</script>

<template>
  <section class="placeholder-view">
    <p class="eyebrow">Phase 3 connection</p>
    <h1>Explore</h1>

    <p v-if="loading" class="placeholder-copy" aria-live="polite">
      Loading places...
    </p>

    <p v-else-if="error" class="placeholder-copy" role="alert">
      {{ error }}
    </p>

    <p v-else-if="places.length === 0" class="placeholder-copy" aria-live="polite">
      No places found.
    </p>

    <ul v-else class="places-list" aria-label="Places">
      <li v-for="place in places" :key="place.id">
        {{ place.name }}
      </li>
    </ul>
  </section>
</template>
