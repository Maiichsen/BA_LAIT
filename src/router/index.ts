import { createRouter, createWebHistory } from 'vue-router';
import LoginLayout from '@/components/layouts/LoginLayout.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import { getAuthUser } from '@/services/userService.ts';

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
			path: '/create_course/:course_id',
			name: 'frontpageCreateCourse',
			meta: {
				layout: DefaultLayout,
			},
			props: true,
			component: () => import('@/views/courseEditorViews/CourseEditorView.vue'),
			children: [
				{
					path: '',
					name: 'courseEditorFrontpage',
					props: true,
					component: () => import('@/views/courseEditorViews/CourseEditorDetailsView.vue'),
				},
				{
					path: ':page_id',
					name: 'courseEditorPage',
					props: true,
					component: () => import('@/views/courseEditorViews/CourseEditorPageView.vue'),
				},
			],
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
			path: '/tester',
			name: 'tester',
			meta: {
				layout: DefaultLayout,
			},
			component: () => import('../views/UpdateUserView.vue'),
		},
		{
			path: '/opret',
			name: 'updateUser',
			meta: {
				layout: LoginLayout,
			},
			component: () => import('../views/SignupView.vue'),
			beforeEnter: async (_to, _from, next) => {
				const user = await getAuthUser();
				if (!user) {
					return next({ name: 'login' });
				}
				return next();
			},
		},
	],
});

export default router;
