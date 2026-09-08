<script setup lang="ts">
import { computed } from 'vue'

import { PLACE_CATEGORIES, type PlaceCategory } from '../types/place'

import FilterDropdown from './FilterDropdown.vue'
import { useLanguageStore } from '../stores/language'

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
const languageStore = useLanguageStore()

const continentOptions = computed(() => [
  { label: languageStore.t('region'), value: '' },
  ...continents.map((value) => ({
    label:
      languageStore.locale === 'zh'
        ? ({
            ASIA: '亚洲',
            EUROPE: '欧洲',
            NORTH_AMERICA: '北美洲',
            SOUTH_AMERICA: '南美洲',
            AFRICA: '非洲',
            OCEANIA: '大洋洲',
          } as Record<string, string>)[value]
        : value.replace('_', ' '),
    value,
  })),
])
const yearOptions = computed(() => [
  { label: languageStore.t('year'), value: '' },
  ...years.map((value) => ({ label: String(value), value: String(value) })),
])

const categoryLabels: Record<PlaceCategory, string> = {
  RESTAURANT: 'Restaurant',
  CAFE: 'Cafe',
  ATTRACTION: 'Attraction',
  SHOPPING: 'Shopping',
  HOTEL: 'Hotel',
  EVENT: 'Event',
  OTHER: 'Other',
}

const categoryLabelsChinese: Record<PlaceCategory, string> = {
  RESTAURANT: '餐厅',
  CAFE: '咖啡馆',
  ATTRACTION: '景点',
  SHOPPING: '购物',
  HOTEL: '酒店',
  EVENT: '活动',
  OTHER: '其他',
}

const localizedCategoryOptions = computed(() => [
  { label: languageStore.t('category'), value: '' },
  ...PLACE_CATEGORIES.map((value) => ({
    label: languageStore.locale === 'zh' ? categoryLabelsChinese[value] : categoryLabels[value],
    value,
  })),
])
</script>

<template>
  <div class="filter-bar" :aria-label="languageStore.t('placeFilters')">
    <FilterDropdown
      :model-value="category"
      :label="languageStore.t('category')"
      :options="localizedCategoryOptions"
      @update:model-value="emit('update:category', $event as PlaceCategory | '')"
    />
    <FilterDropdown
      :model-value="continent"
      :label="languageStore.t('region')"
      :options="continentOptions"
      @update:model-value="emit('update:continent', $event)"
    />
    <FilterDropdown
      :model-value="year ? String(year) : ''"
      :label="languageStore.t('year')"
      :options="yearOptions"
      @update:model-value="emit('update:year', $event ? Number($event) : null)"
    />

    <button type="button" class="clear-filters" @click="emit('clear')">
      {{ languageStore.t('clearFilters') }}
    </button>
  </div>
</template>
