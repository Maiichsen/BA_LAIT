import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { CoursePage } from '@/types/db.ts';
import { createCoursePage, getAllCoursePagesByCourseId } from '@/services/courseService.ts';

export const useCourseStore = defineStore('course', () => {
	const listOfCoursePages = ref<CoursePage[]>([]);

	const nextOrderIndex = computed(() => {
		if (!listOfCoursePages.value.length) return 1;
		/* add 64 to make space for new inserted pages */
		return Math.max(...listOfCoursePages.value.map(course => course.order_index)) + 64;
	});

	const loadCourse = (courseId: string) => {
		listOfCoursePages.value = [];
		getAllCoursePagesByCourseId(courseId)
			.then(coursePages => {
				listOfCoursePages.value = coursePages;
			})
			.catch(err => {
				console.log(err);
			});
	};

	const addNewCoursePage = (courseId: string) => {
		createCoursePage('Ny side', courseId, nextOrderIndex.value)
			.then(coursePage => {
				listOfCoursePages.value.push(coursePage);
			})
			.catch(err => {
				console.log(err);
			});
	};

	return {
		listOfCoursePages,
		nextOrderIndex,
		loadCourse,
		addNewCoursePage,
	};
});
