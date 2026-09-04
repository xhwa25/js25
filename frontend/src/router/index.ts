import { createRouter, createWebHistory } from 'vue-router'

import ExploreView from '../views/ExploreView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import PlaceDetailView from '../views/PlaceDetailView.vue'
import SavedView from '../views/SavedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'explore', component: ExploreView },
    { path: '/place/:id', name: 'place-detail', component: PlaceDetailView },
    { path: '/saved', name: 'saved', component: SavedView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
})

export default router
