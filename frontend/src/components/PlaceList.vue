<script setup lang="ts">
import PlaceCard from './PlaceCard.vue'
import type { Place } from '../types/place'

defineProps<{
  places: Place[]
}>()
</script>

<template>
  <div class="place-list" aria-label="Places">
    <PlaceCard v-for="place in places" :key="place.id" :place="place" />
  </div>
</template>
