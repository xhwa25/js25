<script setup lang="ts">
import { computed } from 'vue'

import { useFavoritesStore } from '../stores/favorites'

const favoritesStore = useFavoritesStore()
const savedCount = computed(() => favoritesStore.favoriteIds.length)
</script>

<template>
  <header class="app-navbar">
    <RouterLink class="brand" to="/" aria-label="Star Trails home">
      <span class="brand-mark" aria-hidden="true">✦</span>
      <span class="brand-copy">
        <strong>Star<br />Trails</strong>
        <small>PLACE<br />ARCHIVE</small>
      </span>
    </RouterLink>

    <nav class="nav-links" aria-label="Primary navigation">
      <RouterLink class="nav-link" to="/" exact-active-class="router-link-exact-active">
        Locations
      </RouterLink>
      <RouterLink class="nav-link" to="/map" exact-active-class="router-link-exact-active">
        Map
      </RouterLink>
      <RouterLink class="nav-link" to="/saved" exact-active-class="router-link-exact-active">
        Saved {{ savedCount }}
      </RouterLink>
    </nav>

    <div class="archive-status">
      <span>Public<br />archive</span>
      <button type="button" class="status-button" aria-label="Public archive status">◎</button>
    </div>
  </header>
</template>
