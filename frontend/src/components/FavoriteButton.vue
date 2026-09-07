<script setup lang="ts">
import { computed } from 'vue'

import { useFavoritesStore } from '../stores/favorites'

const props = defineProps<{
  placeId: number
}>()

const favoritesStore = useFavoritesStore()
const isSaved = computed(() => favoritesStore.isFavorite(props.placeId))

function toggleFavorite() {
  favoritesStore.toggleFavorite(props.placeId)
}
</script>

<template>
  <button
    type="button"
    class="favorite-button"
    :class="{ 'is-saved': isSaved }"
    :aria-label="isSaved ? 'Remove from saved places' : 'Save place'"
    :aria-pressed="isSaved"
    :title="isSaved ? 'Remove from saved places' : 'Save place'"
    @click.stop.prevent="toggleFavorite"
  >
    <span aria-hidden="true">{{ isSaved ? '♥' : '♡' }}</span>
  </button>
</template>
