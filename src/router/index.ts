import { createRouter, createWebHistory } from 'vue-router';
import LoginLayout from '@/components/layouts/LoginLayout.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import {isUserAuthenticated} from '@/services/userService.ts';

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
      path: '/all_courses',
      name: 'allCourses',
      meta: {
        layout: DefaultLayout,
      },
      component: () => import('../views/AllCoursesView.vue'),
    },
    {
      path: '/my_courses',
      name: 'myCourses',
      meta: {
        layout: DefaultLayout,
      },
      component: () => import('../views/MyCoursesView.vue'),
    },
    {
      path: '/companies',
      name: 'companies',
      meta: {
        layout: DefaultLayout,
      },
      component: () => import('../views/CompaniesView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      meta: {
        layout: DefaultLayout,
      },
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/opret',
      name: 'updateUser',
      meta: {
        layout: DefaultLayout,
      },
      component: () => import('../views/UpdateUserView.vue'),
      beforeEnter: async (_to, _from,next) => {
        const user = await isUserAuthenticated();
        if (!user) {
          return next({name: 'login'});
        }
        return next();
      },
    },
  ],
});

export default router;
