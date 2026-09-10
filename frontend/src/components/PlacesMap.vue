<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import 'mapbox-gl/dist/mapbox-gl.css'
import type { Place } from '../types/place'
import { useLanguageStore } from '../stores/language'
import { customizeMapPalette, MAPBOX_STYLE, mapboxToken, markerColor } from '../services/mapbox'
import { getPlaceName } from '../utils/placeName'

const props = defineProps<{
  places: Place[]
}>()

const emit = defineEmits<{
  select: [place: Place]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
const mapError = ref<string | null>(null)
const map = shallowRef<mapboxgl.Map | null>(null)
const markers = new Map<number, mapboxgl.Marker>()
const languageStore = useLanguageStore()

let resizeObserver: ResizeObserver | null = null


function createMarker(place: Place): mapboxgl.Marker {
  const markerElement = document.createElement('button')
  markerElement.type = 'button'
  markerElement.className = 'globe-marker'
  markerElement.setAttribute(
    'aria-label',
    `${languageStore.t('showPlace')} ${getPlaceName(place, languageStore.locale)}`,
  )
  markerElement.style.setProperty('--marker-color', markerColor(place.category))
  markerElement.addEventListener('click', () => emit('select', place))

  return new mapboxgl.Marker({ element: markerElement })
    .setLngLat([place.longitude, place.latitude])
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
      existingMarker
        .getElement()
        .setAttribute(
          'aria-label',
          `${languageStore.t('showPlace')} ${getPlaceName(place, languageStore.locale)}`,
        )
      return
    }

    markers.set(place.id, createMarker(place))
  })
}

onMounted(async () => {
  await nextTick()

  if (!mapboxToken) {
    mapError.value = languageStore.t('tokenHelp')
    return
  }

  if (!mapContainer.value) {
    mapError.value = languageStore.t('globeContainerUnavailable')
    return
  }

  mapboxgl.accessToken = mapboxToken
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: MAPBOX_STYLE,
    center: [0, 20],
    zoom: 1.35,
    minZoom: 0.8,
    maxZoom: 14,
    attributionControl: true,
  })

  map.value.on('load', () => {
    map.value?.setProjection('globe')
    if (map.value) {
      customizeMapPalette(map.value)
    }
    syncMarkers()
  })

  map.value.on('error', () => {
    mapError.value = languageStore.t('mapLoadError')
  })

  resizeObserver = new ResizeObserver(() => map.value?.resize())
  resizeObserver.observe(mapContainer.value)
})

watch(
  () => props.places,
  () => syncMarkers(),
  { deep: true },
)

watch(
  () => languageStore.locale,
  () => syncMarkers(),
)

onBeforeUnmount(() => {
  markers.forEach((marker) => marker.remove())
  markers.clear()
  resizeObserver?.disconnect()
  resizeObserver = null
  map.value?.remove()
  map.value = null
})
</script>

<template>
  <section class="places-map" :aria-label="languageStore.t('interactiveGlobe')">
    <div class="places-map-header">
      <span>{{ places.length }} {{ languageStore.t('placesCount') }}</span>
    </div>

    <div v-if="mapError" class="places-map-message" role="alert">
      {{ mapError }}
    </div>
    <div v-else ref="mapContainer" class="globe-container"></div>
  </section>
</template>
