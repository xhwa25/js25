<script setup lang="ts">
import { ref } from 'vue'

import FavoriteButton from './FavoriteButton.vue'
import type { Place } from '../types/place'
import { useLanguageStore } from '../stores/language'

defineProps<{
  place: Place
}>()

const imageFailed = ref(false)
const languageStore = useLanguageStore()
</script>

<template>
  <article class="place-card">
    <RouterLink
      class="place-card-link"
      :to="{ name: 'place-detail', params: { id: place.id } }"
      :aria-label="`${languageStore.t('viewDetails')}: ${place.name}`"
    >
      <div class="place-card-media">
        <img
          v-if="place.image_url && !imageFailed"
          :src="place.image_url"
          :alt="place.name"
          class="place-card-image"
          @error="imageFailed = true"
        />
        <div v-else class="place-card-placeholder" :aria-label="languageStore.t('noImage')">
          {{ languageStore.t('noImage') }}
        </div>
      </div>

      <div class="place-card-content">
        <div class="place-card-heading">
          <h2 class="place-card-name">{{ place.name }}</h2>
        </div>
        <p class="place-card-location">{{ place.city }}, {{ place.country }}</p>
        <p class="place-card-year">{{ languageStore.t('visited') }} {{ place.visit_year }}</p>
        <span class="place-card-category">{{ place.category }}</span>
      </div>
    </RouterLink>

    <FavoriteButton class="place-card-favorite" :place-id="place.id" />
  </article>
</template>
