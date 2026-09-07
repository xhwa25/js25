<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import 'mapbox-gl/dist/mapbox-gl.css'
import type { Place } from '../types/place'

const props = defineProps<{
  places: Place[]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
const mapError = ref<string | null>(null)
const map = shallowRef<mapboxgl.Map | null>(null)
const markers = new Map<number, mapboxgl.Marker>()
const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined

function escapeHtml(value: string | number | null): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function popupHtml(place: Place): string {
  return `
    <div class="place-popup">
      <strong>${escapeHtml(place.name)}</strong>
      <span>${escapeHtml(place.category)}</span>
      <span>${escapeHtml(place.city)}, ${escapeHtml(place.country)}</span>
      <span>Visited ${escapeHtml(place.visit_year)}</span>
    </div>
  `
}

function createMarker(place: Place): mapboxgl.Marker {
  const markerElement = document.createElement('button')
  markerElement.type = 'button'
  markerElement.className = 'globe-marker'
  markerElement.setAttribute('aria-label', `Show ${place.name}`)

  return new mapboxgl.Marker({ element: markerElement })
    .setLngLat([place.longitude, place.latitude])
    .setPopup(new mapboxgl.Popup({ offset: 18 }).setHTML(popupHtml(place)))
    .addTo(map.value!)
}

function syncMarkers() {
  if (!map.value) {
    return
  }

  const activeIds = new Set(props.places.map((place) => place.id))
  markers.forEach((marker, id) => {
    if (!activeIds.has(id)) {
      marker.remove()
      markers.delete(id)
    }
  })

  props.places.forEach((place) => {
    const existingMarker = markers.get(place.id)
    if (existingMarker) {
      existingMarker.setLngLat([place.longitude, place.latitude])
      existingMarker.setPopup(new mapboxgl.Popup({ offset: 18 }).setHTML(popupHtml(place)))
      return
    }

    markers.set(place.id, createMarker(place))
  })
}

onMounted(async () => {
  await nextTick()

  if (!mapboxToken) {
    mapError.value = 'Add VITE_MAPBOX_ACCESS_TOKEN to frontend/.env.local to show the globe.'
    return
  }

  if (!mapContainer.value) {
    mapError.value = 'The globe container is unavailable.'
    return
  }

  mapboxgl.accessToken = mapboxToken
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/light-v11',
    center: [0, 20],
    zoom: 1.35,
    minZoom: 0.8,
    maxZoom: 8,
    attributionControl: true,
  })

  map.value.on('load', () => {
    map.value?.setProjection('globe')
    syncMarkers()
  })

  map.value.on('error', () => {
    mapError.value = 'Unable to load the Mapbox globe.'
  })
})

watch(
  () => props.places,
  () => syncMarkers(),
  { deep: true },
)

onBeforeUnmount(() => {
  markers.forEach((marker) => marker.remove())
  markers.clear()
  map.value?.remove()
  map.value = null
})
</script>

<template>
  <section class="places-map" aria-label="Interactive globe with filtered places">
    <div class="places-map-header">
      <h2>Globe</h2>
      <span>{{ places.length }} places</span>
    </div>

    <div v-if="mapError" class="places-map-message" role="alert">
      {{ mapError }}
    </div>
    <div v-else ref="mapContainer" class="globe-container"></div>
  </section>
</template>
