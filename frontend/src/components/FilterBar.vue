<script setup lang="ts">
import { PLACE_CATEGORIES, type PlaceCategory } from '../types/place'

defineProps<{
  category: PlaceCategory | ''
  continent: string
  year: number | null
}>()

const emit = defineEmits<{
  'update:category': [value: PlaceCategory | '']
  'update:continent': [value: string]
  'update:year': [value: number | null]
  clear: []
}>()

const continents = ['ASIA', 'EUROPE', 'NORTH_AMERICA', 'SOUTH_AMERICA', 'AFRICA', 'OCEANIA']
const years = [2026, 2025, 2024, 2023]
</script>

<template>
  <div class="filter-bar" aria-label="Place filters">
    <label>
      <span>Category</span>
      <select
        :value="category"
        @change="emit('update:category', ($event.target as HTMLSelectElement).value as PlaceCategory | '')"
      >
        <option value="">Category</option>
        <option v-for="option in PLACE_CATEGORIES" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </label>

    <label>
      <span>Continent</span>
      <select
        :value="continent"
        @change="emit('update:continent', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Region</option>
        <option v-for="option in continents" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </label>

    <label>
      <span>Visit year</span>
      <select
        :value="year ?? ''"
        @change="emit('update:year', ($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : null)"
      >
        <option value="">Year</option>
        <option v-for="option in years" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </label>

    <button type="button" class="clear-filters" @click="emit('clear')">
      Clear all filters
    </button>
  </div>
</template>
