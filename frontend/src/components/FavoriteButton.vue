<script setup lang="ts">
import { computed } from 'vue'

import { useFavoritesStore } from '../stores/favorites'
import { useLanguageStore } from '../stores/language'

const props = defineProps<{
  placeId: number
}>()

const favoritesStore = useFavoritesStore()
const languageStore = useLanguageStore()
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
    :aria-label="isSaved ? languageStore.t('removeSaved') : languageStore.t('savePlace')"
    :aria-pressed="isSaved"
    :title="isSaved ? languageStore.t('removeSaved') : languageStore.t('savePlace')"
    @click.stop.prevent="toggleFavorite"
  >
    <span aria-hidden="true">{{ isSaved ? '♥' : '♡' }}</span>
  </button>
</template>
