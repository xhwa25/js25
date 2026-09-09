<script setup lang="ts">
import { computed } from 'vue'

import { useFavoritesStore } from '../stores/favorites'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { useLanguageStore } from '../stores/language'

const favoritesStore = useFavoritesStore()
const languageStore = useLanguageStore()
const savedCount = computed(() => favoritesStore.favoriteIds.length)
</script>

<template>
  <header class="app-navbar">
    <RouterLink class="brand" to="/" aria-label="JS25 World home">
      <span class="brand-mark" aria-hidden="true">✦</span>
      <span class="brand-copy">
        <strong>JS25<br />World</strong>
        <small>PLACE<br />ARCHIVE</small>
      </span>
    </RouterLink>

    <nav class="nav-links" :aria-label="languageStore.t('primaryNavigation')">
      <RouterLink class="nav-link" to="/" exact-active-class="router-link-exact-active">
        {{ languageStore.t('locations') }}
      </RouterLink>
      <RouterLink class="nav-link" to="/map" exact-active-class="router-link-exact-active">
        {{ languageStore.t('map') }}
      </RouterLink>
      <RouterLink class="nav-link" to="/saved" exact-active-class="router-link-exact-active">
        {{ languageStore.t('saved') }} {{ savedCount }}
      </RouterLink>
    </nav>

    <LanguageSwitcher />
  </header>
</template>
