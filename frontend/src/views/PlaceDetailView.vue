<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

import 'mapbox-gl/dist/mapbox-gl.css'
import FavoriteButton from '../components/FavoriteButton.vue'
import VisitorNotes from '../components/VisitorNotes.vue'
import { getPlaceById } from '../services/places'
import type { Place } from '../types/place'
import { useLanguageStore } from '../stores/language'
import { customizeMapPalette, MAPBOX_STYLE, mapboxToken, markerColor } from '../services/mapbox'
import { getPlaceName, getPlaceNameSubtitle } from '../utils/placeName'
import { localizePlaceCategory } from '../utils/placeLocalization'

const route = useRoute()
const languageStore = useLanguageStore()
const place = ref<Place | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const imageFailed = ref(false)
const mapContainer = ref<HTMLDivElement | null>(null)

const detailMap = shallowRef<mapboxgl.Map | null>(null)
const detailMarker = shallowRef<mapboxgl.Marker | null>(null)
let resizeObserver: ResizeObserver | null = null
const displayName = computed(() =>
  place.value ? getPlaceName(place.value, languageStore.locale) : '',
)
const nameSubtitle = computed(() =>
  place.value ? getPlaceNameSubtitle(place.value, languageStore.locale) : null,
)

function resetMap() {
  detailMarker.value?.remove()
  detailMarker.value = null
  detailMap.value?.remove()
  detailMap.value = null
  resizeObserver?.disconnect()
  resizeObserver = null
}

function renderMap(currentPlace: Place) {
  if (!mapContainer.value) {
    return
  }

  resetMap()
  if (!mapboxToken) {
    return
  }

  mapboxgl.accessToken = mapboxToken
  detailMap.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: MAPBOX_STYLE,
    center: [currentPlace.longitude, currentPlace.latitude],
    zoom: 13,
    minZoom: 2,
    maxZoom: 18,
    attributionControl: true,
  })

  detailMap.value.on('load', () => {
    if (!detailMap.value) {
      return
    }

    customizeMapPalette(detailMap.value)
    const markerElement = document.createElement('button')
    markerElement.type = 'button'
    markerElement.className = 'globe-marker detail-map-marker'
    markerElement.style.setProperty('--marker-color', markerColor(currentPlace.category))
    markerElement.setAttribute(
      'aria-label',
      `${languageStore.t('showPlace')} ${getPlaceName(currentPlace, languageStore.locale)}`,
    )
    detailMarker.value = new mapboxgl.Marker({ element: markerElement })
      .setLngLat([currentPlace.longitude, currentPlace.latitude])
      .addTo(detailMap.value)
  })

  detailMap.value.on('error', () => {
    // The detail view still shows the place information if Mapbox cannot load.
  })

  resizeObserver = new ResizeObserver(() => detailMap.value?.resize())
  resizeObserver.observe(mapContainer.value)
}

async function loadPlace() {
  const id = Number(route.params.id)

  loading.value = true
  error.value = null
  place.value = null
  imageFailed.value = false
  resetMap()

  if (!Number.isInteger(id) || id <= 0) {
    error.value = languageStore.t('placeNotFound')
    loading.value = false
    return
  }

  try {
    const result = await getPlaceById(id)

    if (!result) {
      error.value = languageStore.t('placeNotFound')
      return
    }

    place.value = result
    loading.value = false
    await nextTick()
    renderMap(result)
  } catch {
    error.value = languageStore.t('unableLoadPlace')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadPlace()
})

watch(
  () => route.params.id,
  () => {
    void loadPlace()
  },
)

watch(
  () => languageStore.locale,
  () => {
    if (place.value && detailMarker.value) {
      detailMarker.value
        .getElement()
        .setAttribute('aria-label', `${languageStore.t('showPlace')} ${displayName.value}`)
    }
  },
)

onBeforeUnmount(resetMap)
</script>

<template>
  <section class="place-detail-view" aria-labelledby="place-detail-title">
    <RouterLink class="place-detail-back" to="/">{{ languageStore.t('backToPlaces') }}</RouterLink>

    <p v-if="loading" class="placeholder-copy" aria-live="polite">{{ languageStore.t('loadingPlace') }}</p>

    <div v-else-if="error" class="place-detail-message" role="alert">
      <h1>{{ languageStore.t('placeUnavailable') }}</h1>
      <p>{{ error }}</p>
    </div>

    <article v-else-if="place" class="place-detail">
      <div class="place-detail-info">
        <div class="place-detail-visual">
          <img
            v-if="place.image_url && !imageFailed"
            :src="place.image_url"
            :alt="displayName"
            class="place-detail-image"
            @error="imageFailed = true"
          />
          <div v-else class="place-detail-image place-card-placeholder">{{ languageStore.t('noImage') }}</div>
        </div>

        <div class="place-detail-content">
          <div class="place-detail-kicker-row">
            <span class="place-card-category">{{ localizePlaceCategory(place.category, languageStore.locale) }}</span>
            <FavoriteButton :place-id="place.id" />
          </div>

          <div class="place-detail-heading">
            <p class="eyebrow">{{ languageStore.t('placeDetails') }}</p>
            <h1 id="place-detail-title">{{ displayName }}</h1>
            <p v-if="nameSubtitle" class="place-name-subtitle">{{ nameSubtitle }}</p>
            <p class="place-detail-location">{{ place.city }}, {{ place.country }}</p>
          </div>

          <dl class="place-detail-facts">
            <div>
              <dt>{{ languageStore.t('visited') }}</dt>
              <dd>{{ place.visit_year }}</dd>
            </div>
            <div>
              <dt>{{ languageStore.t('address') }}</dt>
              <dd>{{ place.address || languageStore.t('notProvided') }}</dd>
            </div>
            <div v-if="place.map_url">
              <dt>{{ languageStore.t('location') }}</dt>
              <dd>
                <a :href="place.map_url" target="_blank" rel="noreferrer noopener">
                  {{ languageStore.t('openGoogleMaps') }}
                </a>
              </dd>
            </div>
          </dl>

          <div class="place-detail-description">
            <h2>{{ languageStore.t('aboutPlace') }}</h2>
            <p>{{ place.description || languageStore.t('noDescription') }}</p>
          </div>

          <VisitorNotes :place-id="place.id" />
        </div>
      </div>

      <div class="place-detail-map-wrap">
        <div class="place-detail-map-label">{{ languageStore.t('location') }}</div>
        <div ref="mapContainer" class="place-detail-map" :aria-label="languageStore.t('location')"></div>
      </div>
    </article>
  </section>
</template>
