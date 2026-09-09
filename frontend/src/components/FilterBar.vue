<script setup lang="ts">
import { computed } from 'vue'

import { PLACE_CATEGORIES, type PlaceCategory } from '../types/place'

import FilterDropdown from './FilterDropdown.vue'
import { useLanguageStore } from '../stores/language'

const emit = defineEmits<{
  'update:categories': [value: PlaceCategory[]]
  'update:countries': [value: string[]]
  'update:cities': [value: string[]]
  'update:years': [value: number[]]
  clear: []
}>()

const languageStore = useLanguageStore()

const props = defineProps<{
  categories: PlaceCategory[]
  countries: string[]
  cities: string[]
  years: number[]
  countryOptions: string[]
  cityOptions: string[]
  yearOptions: number[]
}>()

const localizedCountryOptions = computed(() =>
  props.countryOptions.map((value) => ({ label: value, value })),
)
const localizedYearOptions = computed(() =>
  props.yearOptions.map((value) => ({ label: String(value), value: String(value) })),
)
const localizedCityOptions = computed(() =>
  props.cityOptions.map((value) => ({ label: value, value })),
)

const categoryLabels: Record<PlaceCategory, string> = {
  RESTAURANT: 'Restaurant',
  CAFE: 'Cafe',
  ATTRACTION: 'Attraction',
  OTHER: 'Other',
}

const categoryLabelsChinese: Record<PlaceCategory, string> = {
  RESTAURANT: '餐厅',
  CAFE: '咖啡馆',
  ATTRACTION: '景点',
  OTHER: '其他',
}

const localizedCategoryOptions = computed(() => [
  ...PLACE_CATEGORIES.map((value) => ({
    label: languageStore.locale === 'zh' ? categoryLabelsChinese[value] : categoryLabels[value],
    value,
  })),
])
</script>

<template>
  <div class="filter-bar" :aria-label="languageStore.t('placeFilters')">
    <FilterDropdown
      :model-value="categories"
      :label="languageStore.t('category')"
      :options="localizedCategoryOptions"
      @update:model-value="emit('update:categories', $event as PlaceCategory[])"
    />
    <FilterDropdown
      :model-value="countries"
      :label="languageStore.t('country')"
      :options="localizedCountryOptions"
      @update:model-value="emit('update:countries', $event)"
    />
    <FilterDropdown
      :model-value="cities"
      :label="languageStore.t('city')"
      :options="localizedCityOptions"
      @update:model-value="emit('update:cities', $event)"
    />
    <FilterDropdown
      :model-value="years.map(String)"
      :label="languageStore.t('year')"
      :options="localizedYearOptions"
      @update:model-value="emit('update:years', $event.map(Number))"
    />

    <button type="button" class="clear-filters" @click="emit('clear')">
      {{ languageStore.t('clearFilters') }}
    </button>
  </div>
</template>
