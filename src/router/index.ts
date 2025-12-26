import { createRouter, createWebHistory } from 'vue-router';
import LoginLayout from '@/components/layouts/LoginLayout.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import { getAuthUser } from '@/services/userService.ts';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/log-ind',
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
			beforeEnter: async (_to, _from, next) => {
				try {
					const user = await getAuthUser();
					if (!user) {
						return next({ name: 'login' });
					}
					return next();
				} catch (err) {
					console.error('route guard getAuthUser error:', err);
					return next({ name: 'login' });
				}
			},
		},
		{
			path: '/',
			name: 'frontpage',
			meta: {
				layout: DefaultLayout,
			},
			component: () => import('../views/AllCoursesView.vue'),
			beforeEnter: async (_to, _from, next) => {
				try {
					const user = await getAuthUser();
					if (!user) {
						return next({ name: 'login' });
					}
					return next();
				} catch (err) {
					console.error('route guard getAuthUser error:', err);
					return next({ name: 'login' });
				}
			},
		},
		{
			path: '/Kursister',
			name: 'participants',
			meta: {
				layout: DefaultLayout,
			},
			component: () => import('../views/CourseParticipants.vue'),
			beforeEnter: async (_to, _from, next) => {
				try {
					const user = await getAuthUser();
					if (!user) {
						return next({ name: 'login' });
					}
					return next();
				} catch (err) {
					console.error('route guard getAuthUser error:', err);
					return next({ name: 'login' });
				}
			},
		},
		{
			path: '/opret-kursus/:course_id',
			name: 'frontpageCreateCourse',
			meta: {
				layout: DefaultLayout,
			},
			props: true,
			component: () => import('@/views/courseEditorViews/CourseEditorView.vue'),
			beforeEnter: async (_to, _from, next) => {
				try {
					const user = await getAuthUser();
					if (!user) {
						return next({ name: 'login' });
					}
					return next();
				} catch (err) {
					console.error('route guard getAuthUser error:', err);
					return next({ name: 'login' });
				}
			},
			children: [
				{
					path: '',
					name: 'courseEditorFrontpage',
					props: true,
					component: () => import('@/views/courseEditorViews/CourseEditorDetailsView.vue'),
					beforeEnter: async (_to, _from, next) => {
						try {
							const user = await getAuthUser();
							if (!user) {
								return next({ name: 'login' });
							}
							return next();
						} catch (err) {
							console.error('route guard getAuthUser error:', err);
							return next({ name: 'login' });
						}
					},
				},
				{
					path: ':page_id',
					name: 'courseEditorPage',
					props: true,
					component: () => import('@/views/courseEditorViews/CourseEditorPageView.vue'),
					beforeEnter: async (_to, _from, next) => {
						try {
							const user = await getAuthUser();
							if (!user) {
								return next({ name: 'login' });
							}
							return next();
						} catch (err) {
							console.error('route guard getAuthUser error:', err);
							return next({ name: 'login' });
						}
					},
				},
			],
		},
		{
			path: '/mine-kurser',
			name: 'myCourses',
			meta: {
				layout: DefaultLayout,
			},
			component: () => import('../views/MyCoursesView.vue'),
			beforeEnter: async (_to, _from, next) => {
				try {
					const user = await getAuthUser();
					if (!user) {
						return next({ name: 'login' });
					}
					return next();
				} catch (err) {
					console.error('route guard getAuthUser error:', err);
					return next({ name: 'login' });
				}
			},
		},
		{
			path: '/virksomheder',
			name: 'companies',
			meta: {
				layout: DefaultLayout,
			},
			component: () => import('../views/CompaniesView.vue'),
			beforeEnter: async (_to, _from, next) => {
				try {
					const user = await getAuthUser();
					if (!user) {
						return next({ name: 'login' });
					}
					return next();
				} catch (err) {
					console.error('route guard getAuthUser error:', err);
					return next({ name: 'login' });
				}
			},
		},
		{
			path: '/kontakt',
			name: 'contact',
			meta: {
				layout: DefaultLayout,
			},
			component: () => import('../views/ContactView.vue'),
			beforeEnter: async (_to, _from, next) => {
				try {
					const user = await getAuthUser();
					if (!user) {
						return next({ name: 'login' });
					}
					return next();
				} catch (err) {
					console.error('route guard getAuthUser error:', err);
					return next({ name: 'login' });
				}
			},
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
				try {
					const user = await getAuthUser();
					if (!user) {
						return next({ name: 'login' });
					}
					return next();
				} catch (err) {
					console.error('route guard getAuthUser error:', err);
					return next({ name: 'login' });
				}
			},
		},
	],
});

export default router;
