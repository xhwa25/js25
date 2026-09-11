<script setup lang="ts">
import PlaceCard from './PlaceCard.vue'
import type { Place } from '../types/place'

withDefaults(
  defineProps<{
    places: Place[]
    eagerImageCount?: number
  }>(),
  {
    eagerImageCount: 3,
  },
)
</script>

<template>
  <div class="place-list" aria-label="Places">
    <PlaceCard
      v-for="(place, index) in places"
      :key="place.id"
      :place="place"
      :image-loading="index < eagerImageCount ? 'eager' : 'lazy'"
    />
  </div>
</template>
