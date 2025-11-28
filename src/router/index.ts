import { createRouter, createWebHistory } from 'vue-router';
import LoginLayout from '@/components/layouts/LoginLayout.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        layout: LoginLayout,
      },
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/alle-kurser',
      name: 'allCourses',
      meta: {
        layout: DefaultLayout,
      },
      component: () => import('../views/AllCoursesView.vue'),
    },
  ],
});

export default router;
