<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface DropdownOption {
  label: string
  value: string
}

const props = defineProps<{
  label: string
  modelValue: string[]
  options: DropdownOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const root = ref<HTMLElement | null>(null)
const open = ref(false)

function closeOnOutside(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) {
    open.value = false
  }
}

const triggerLabel = computed(() => {
  if (props.modelValue.length === 0) {
    return props.label
  }

  if (props.modelValue.length === 1) {
    return props.options.find((option) => option.value === props.modelValue[0])?.label ?? props.label
  }

  return `${props.label} (${props.modelValue.length})`
})

function toggleOption(value: string) {
  const nextValues = props.modelValue.includes(value)
    ? props.modelValue.filter((currentValue) => currentValue !== value)
    : [...props.modelValue, value]

  emit('update:modelValue', nextValues)
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
      <span>{{ triggerLabel }}</span>
      <span class="filter-dropdown-chevron" aria-hidden="true">⌄</span>
    </button>

    <div
      v-if="open"
      class="filter-dropdown-menu"
      role="listbox"
      aria-multiselectable="true"
      :aria-label="label"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="filter-dropdown-option"
        :class="{ 'is-selected': modelValue.includes(option.value) }"
        role="option"
        :aria-selected="modelValue.includes(option.value)"
        @click="toggleOption(option.value)"
      >
        <span>{{ option.label }}</span>
        <span class="filter-dropdown-checkbox" aria-hidden="true">
          <span v-if="modelValue.includes(option.value)">✓</span>
        </span>
      </button>
    </div>
  </div>
</template>
