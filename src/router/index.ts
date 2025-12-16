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
		},
		{
			path: '/',
			name: 'frontpage',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Forside',
			},
			component: () => import('../views/AllCoursesView.vue'),
		},
		{
			path: '/Kursister',
			name: 'students',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Kursister',
			},
			component: () => import('../views/CourseStudents.vue'),
		},
		{
			path: '/opret-kursus/:course_id',
			name: 'frontpageCreateCourse',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Opret Kursus',
			},
			props: true,
			component: () => import('@/views/courseEditorViews/CourseEditorView.vue'),
			children: [
				{
					path: '',
					name: 'courseEditorFrontpage',
					props: true,
					meta: {
						breadcrumb: 'Kursus Detaljer',
					},
					component: () => import('@/views/courseEditorViews/CourseEditorDetailsView.vue'),
				},
				{
					path: ':page_id',
					name: 'courseEditorPage',
					props: true,
					meta: {
						breadcrumb: 'Kursus Side',
					},
					component: () => import('@/views/courseEditorViews/CourseEditorPageView.vue'),
				},
			],
		},
		{
			path: '/mine-kurser',
			name: 'myCourses',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Mine Kurser',
			},
			component: () => import('../views/MyCoursesView.vue'),
		},
		{
			path: '/virksomheder',
			name: 'companies',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Virksomheder',
			},
			component: () => import('../views/CompaniesView.vue'),
		},
		{
			path: '/kontakt',
			name: 'contact',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Kontakt',
			},
			component: () => import('../views/ContactView.vue'),
		},
		{
			path: '/opret',
			name: 'updateUser',
			meta: {
				layout: DefaultLayout,
				breadcrumb: 'Opret Bruger',
			},
			component: () => import('../views/UpdateUserView.vue'),
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
