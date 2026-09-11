<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import PlaceCard from './PlaceCard.vue'
import type { Place } from '../types/place'

const props = defineProps<{
  places: Place[]
  eagerImageCount?: number
}>()

const mobileQuery = typeof window === 'undefined' ? null : window.matchMedia('(max-width: 640px)')
const tabletQuery = typeof window === 'undefined' ? null : window.matchMedia('(max-width: 1000px)')
const responsiveEagerImageCount = ref(
  mobileQuery?.matches ? 1 : tabletQuery?.matches ? 2 : 3,
)

function updateResponsiveEagerImageCount() {
  responsiveEagerImageCount.value = mobileQuery?.matches ? 1 : tabletQuery?.matches ? 2 : 3
}

const resolvedEagerImageCount = computed(
  () => props.eagerImageCount ?? responsiveEagerImageCount.value,
)
const priorityImagePlaceId = computed(
  () => props.places.find((place) => place.image_url)?.id ?? null,
)

onMounted(() => {
  mobileQuery?.addEventListener('change', updateResponsiveEagerImageCount)
  tabletQuery?.addEventListener('change', updateResponsiveEagerImageCount)
})

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', updateResponsiveEagerImageCount)
  tabletQuery?.removeEventListener('change', updateResponsiveEagerImageCount)
})
</script>

<template>
  <div class="place-list" aria-label="Places">
    <PlaceCard
      v-for="(place, index) in places"
      :key="place.id"
      :place="place"
      :image-loading="index < resolvedEagerImageCount ? 'eager' : 'lazy'"
      :image-fetch-priority="
        place.id === priorityImagePlaceId && index < resolvedEagerImageCount ? 'high' : 'auto'
      "
    />
  </div>
</template>
