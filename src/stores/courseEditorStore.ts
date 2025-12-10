import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {CoursePage} from '@/types/db.ts';
import {
	createCoursePage,
	getAllCoursePagesByCourseId,
} from '@/services/courseService.ts';

export const useCourseEditorStore = defineStore('courseEditor', () => {
	const courseGlobalLoading = ref(false);
	const currentEditedCourseId = ref('');
	const currentEditedCoursePageId = ref<string | null>(null);
	const listOfCoursePages = ref<CoursePage[]>([]);

	const nextOrderIndex = computed(() => {
		if (!listOfCoursePages.value.length) return 1;
		/* add 64 to make space for new inserted pages */
		return Math.max(...listOfCoursePages.value.map(course => course.order_index)) + 64;
	});

	const loadCourse = (courseId: string) => {
		courseGlobalLoading.value = true;
		listOfCoursePages.value = [];
		currentEditedCourseId.value = courseId;
		currentEditedCoursePageId.value = '';

		getAllCoursePagesByCourseId(courseId).then((coursePages) => {
			listOfCoursePages.value = coursePages;
		}).catch((err) => {
			console.log(err);
		}).finally(() => {
			courseGlobalLoading.value = false;
		});
	};

	const addNewCoursePage = () => {
		createCoursePage('Ny side', currentEditedCourseId.value, nextOrderIndex.value).then((coursePage) => {
			console.log('ADD NEW PAGE');
			listOfCoursePages.value.push(coursePage);
		}).catch((err) => {
			console.log(err);
		});
	};

	const setCurrentEditedCoursePage = (pageId?: string) => {
		currentEditedCoursePageId.value = pageId ?? null;
	};

	return {
		listOfCoursePages,
		courseGlobalLoading,
		currentEditedCourseId,
		nextOrderIndex,
		loadCourse,
		addNewCoursePage,
		setCurrentEditedCoursePage,
	};
});
