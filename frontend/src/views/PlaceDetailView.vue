<script setup lang="ts">
import L from 'leaflet'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import 'leaflet/dist/leaflet.css'
import FavoriteButton from '../components/FavoriteButton.vue'
import { getPlaceById } from '../services/places'
import type { Place } from '../types/place'

const route = useRoute()
const place = ref<Place | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const imageFailed = ref(false)
const mapContainer = ref<HTMLDivElement | null>(null)

let detailMap: L.Map | null = null

function resetMap() {
  detailMap?.remove()
  detailMap = null
}

function renderMap(currentPlace: Place) {
  if (!mapContainer.value) {
    return
  }

  resetMap()
  detailMap = L.map(mapContainer.value, {
    scrollWheelZoom: false,
  }).setView([currentPlace.latitude, currentPlace.longitude], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(detailMap)

  const popupContent = document.createElement('span')
  popupContent.textContent = currentPlace.name

  L.marker([currentPlace.latitude, currentPlace.longitude])
    .addTo(detailMap)
    .bindPopup(popupContent)
    .openPopup()
}

async function loadPlace() {
  const id = Number(route.params.id)

  loading.value = true
  error.value = null
  place.value = null
  imageFailed.value = false
  resetMap()

  if (!Number.isInteger(id) || id <= 0) {
    error.value = 'Place not found.'
    loading.value = false
    return
  }

  try {
    const result = await getPlaceById(id)

    if (!result) {
      error.value = 'Place not found.'
      return
    }

    place.value = result
    await nextTick()
    renderMap(result)
  } catch {
    error.value = 'Unable to load this place.'
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

onBeforeUnmount(resetMap)
</script>

<template>
  <section class="place-detail-view" aria-labelledby="place-detail-title">
    <RouterLink class="place-detail-back" to="/">Back to places</RouterLink>

    <p v-if="loading" class="placeholder-copy" aria-live="polite">Loading place...</p>

    <div v-else-if="error" class="place-detail-message" role="alert">
      <h1>Place unavailable</h1>
      <p>{{ error }}</p>
    </div>

    <article v-else-if="place" class="place-detail">
      <div class="place-detail-heading">
        <div>
          <p class="eyebrow">Place details</p>
          <h1 id="place-detail-title">{{ place.name }}</h1>
          <p class="place-detail-location">{{ place.city }}, {{ place.country }}</p>
        </div>
        <div class="place-detail-actions">
          <span class="place-card-category">{{ place.category }}</span>
          <FavoriteButton :place-id="place.id" />
        </div>
      </div>

      <div class="place-detail-layout">
        <div class="place-detail-main">
          <img
            v-if="place.image_url && !imageFailed"
            :src="place.image_url"
            :alt="place.name"
            class="place-detail-image"
            @error="imageFailed = true"
          />
          <div v-else class="place-detail-image place-card-placeholder">No image</div>

          <dl class="place-detail-facts">
            <div>
              <dt>Address</dt>
              <dd>{{ place.address || 'Not provided' }}</dd>
            </div>
            <div>
              <dt>Visited</dt>
              <dd>{{ place.visit_year }}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>
                <a v-if="place.source_url" :href="place.source_url" target="_blank" rel="noreferrer">
                  Open source link
                </a>
                <span v-else>Not provided</span>
              </dd>
            </div>
          </dl>

          <div class="place-detail-description">
            <h2>About this place</h2>
            <p>{{ place.description || 'No description available.' }}</p>
          </div>
        </div>

        <div class="place-detail-map-wrap">
          <h2>Location</h2>
          <div ref="mapContainer" class="place-detail-map" aria-label="Map location"></div>
        </div>
      </div>
    </article>
  </section>
</template>
