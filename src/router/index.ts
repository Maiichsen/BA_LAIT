import { createRouter, createWebHistory } from 'vue-router';
import LoginLayout from '@/components/layouts/LoginLayout.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import { getAuthUser } from '@/services/userService.ts';
import CourseEditorLayout from '@/components/layouts/CourseEditorLayout.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	scrollBehavior(_to, _from, savedPosition) {
		//browser back/forward, gå tilbage til den gemte position
		if (savedPosition) {
			return savedPosition;
		}
		// Ellers scroll til toppen af siden
		return { top: 0, behavior: 'smooth' };
	},
	routes: [
		{
			path: '/log-ind',
			name: 'login',
			meta: {
				layout: LoginLayout,
				breadcrumb: 'Log Ind',
			},
			component: () => import('../views/LoginView.vue'),
		},
		{
			path: '/alle-kurser',
			name: 'allCourses',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Alle Kurser',
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
				breadcrumb: 'Forside',
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
			name: 'students',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Kursister',
			},
			component: () => import('../views/StudentPage.vue'),
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
				layout: CourseEditorLayout,
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
					meta: {
						breadcrumb: 'Kursus Detaljer',
					},
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
					meta: {
						breadcrumb: 'Kursus Side',
					},
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
			path: '/kurser/:course_id',
			name: 'courseDetail',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Kursus Detaljer',
				parentBreadcrumb: {
					name: 'Alle Kurser',
					path: '/alle-kurser',
				},
			},
			props: true,
			component: () => import('../views/CourseDetailView.vue'),
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
			path: '/mine-kurser',
			name: 'myCourses',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Mine Kurser',
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
				breadcrumb: 'Virksomheder',
			},
			component: () => import('../views/CompanyPage.vue'),
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
				breadcrumb: 'Kontakt',
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
				breadcrumb: 'Opret Bruger',
			},
			component: () => import('../views/SignupView.vue'),
		},
	],
});

export default router;
