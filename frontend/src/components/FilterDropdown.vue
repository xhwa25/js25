<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface DropdownOption {
  label: string
  value: string
}

defineProps<{
  label: string
  modelValue: string
  options: DropdownOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const root = ref<HTMLElement | null>(null)
const open = ref(false)

function closeOnOutside(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) {
    open.value = false
  }
}

function selectOption(value: string) {
  emit('update:modelValue', value)
  open.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', closeOnOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', closeOnOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="root" class="filter-dropdown" :class="{ 'is-open': open }">
    <button
      type="button"
      class="filter-dropdown-trigger"
      :aria-expanded="open"
      :aria-haspopup="'listbox'"
      @click="open = !open"
    >
      <span>{{ options.find((option) => option.value === modelValue)?.label ?? label }}</span>
      <span class="filter-dropdown-chevron" aria-hidden="true">⌄</span>
    </button>

    <div v-if="open" class="filter-dropdown-menu" role="listbox" :aria-label="label">
      <button
        v-for="option in options"
        :key="option.value || 'all'"
        type="button"
        class="filter-dropdown-option"
        :class="{ 'is-selected': option.value === modelValue }"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="selectOption(option.value)"
      >
        <span>{{ option.label }}</span>
        <span v-if="option.value === modelValue" class="filter-dropdown-check" aria-hidden="true">✓</span>
      </button>
    </div>
  </div>
</template>
