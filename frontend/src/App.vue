<script setup lang="ts">
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <AppNavbar />
  <main class="app-shell">
    <RouterView />
  </main>
</template>
