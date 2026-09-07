<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.modelValue,
  (value) => {
    inputValue.value = value
  },
)

function handleInput(event: Event) {
  inputValue.value = (event.target as HTMLInputElement).value
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    emit('update:modelValue', inputValue.value)
  }, 300)
}

onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <label class="search-bar">
    <span class="sr-only">Search places, cities, or countries</span>
    <span class="search-icon" aria-hidden="true">⌕</span>
    <input
      :value="inputValue"
      type="search"
      placeholder="Search places, cities, or countries"
      @input="handleInput"
    />
  </label>
</template>
