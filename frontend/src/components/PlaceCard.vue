<script setup lang="ts">
import { computed, ref } from 'vue'

import FavoriteButton from './FavoriteButton.vue'
import type { Place } from '../types/place'
import { useLanguageStore } from '../stores/language'
import { getPlaceName, getPlaceNameSubtitle } from '../utils/placeName'
import { localizePlaceCategory } from '../utils/placeLocalization'

const props = defineProps<{
  place: Place
}>()

const imageFailed = ref(false)
const languageStore = useLanguageStore()
const displayName = computed(() => getPlaceName(props.place, languageStore.locale))
const nameSubtitle = computed(() => getPlaceNameSubtitle(props.place, languageStore.locale))
const displayCategory = computed(() =>
  localizePlaceCategory(props.place.category, languageStore.locale),
)
</script>

<template>
  <article class="place-card">
    <RouterLink
      class="place-card-link"
      :to="{ name: 'place-detail', params: { id: place.id } }"
      :aria-label="`${languageStore.t('viewDetails')}: ${displayName}`"
    >
      <div class="place-card-media">
        <img
          v-if="place.image_url && !imageFailed"
          :src="place.image_url"
          :alt="displayName"
          class="place-card-image"
          @error="imageFailed = true"
        />
        <div v-else class="place-card-placeholder" :aria-label="languageStore.t('noImage')">
          {{ languageStore.t('noImage') }}
        </div>
      </div>

      <div class="place-card-content">
        <div class="place-card-heading">
          <div class="place-card-name-group">
            <h2 class="place-card-name">{{ displayName }}</h2>
            <p v-if="nameSubtitle" class="place-name-subtitle">{{ nameSubtitle }}</p>
          </div>
        </div>
        <p class="place-card-location">{{ place.city }}, {{ place.country }}</p>
        <p class="place-card-year">{{ languageStore.t('visited') }} {{ place.visit_year }}</p>
        <span class="place-card-category">{{ displayCategory }}</span>
      </div>
    </RouterLink>

    <FavoriteButton class="place-card-favorite" :place-id="place.id" />
  </article>
</template>
