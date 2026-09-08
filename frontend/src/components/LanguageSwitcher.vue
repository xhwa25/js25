<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useLanguageStore } from '../stores/language'

const languageStore = useLanguageStore()
const { locale } = storeToRefs(languageStore)
</script>

<template>
  <div class="language-switcher" role="group" :aria-label="languageStore.t('languageSwitcher')">
    <button
      type="button"
      :class="{ 'is-active': locale === 'en' }"
      :aria-pressed="locale === 'en'"
      @click="languageStore.setLocale('en')"
    >
      {{ languageStore.t('english') }}
    </button>
    <span aria-hidden="true">|</span>
    <button
      type="button"
      :class="{ 'is-active': locale === 'zh' }"
      :aria-pressed="locale === 'zh'"
      @click="languageStore.setLocale('zh')"
    >
      {{ languageStore.t('chinese') }}
    </button>
  </div>
</template>
