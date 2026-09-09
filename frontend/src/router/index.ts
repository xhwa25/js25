import { createRouter, createWebHistory } from 'vue-router'

import ExploreView from '../views/ExploreView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'explore', component: ExploreView },
    { path: '/map', name: 'map', component: () => import('../views/MapView.vue') },
    {
      path: '/place/:id',
      name: 'place-detail',
      component: () => import('../views/PlaceDetailView.vue'),
    },
    { path: '/saved', name: 'saved', component: () => import('../views/SavedView.vue') },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
