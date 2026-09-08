<script setup lang="ts">
import { useLanguageStore } from '../stores/language'

const languageStore = useLanguageStore()
</script>

<template>
  <section class="placeholder-view">
    <p class="eyebrow">404</p>
    <h1>{{ languageStore.t('pageNotFound') }}</h1>
    <p class="placeholder-copy">{{ languageStore.t('pageNotFoundHelp') }}</p>
  </section>
</template>
