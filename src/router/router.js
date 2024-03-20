import { createRouter, createWebHistory } from 'vue-router';
import auth from '../components/auth/the-auth.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'auth',
      component: auth,
    },
  ],
});

export default router;
