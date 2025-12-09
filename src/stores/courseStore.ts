import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { CoursePage } from '@/types/db.ts';

export const useCourseStore = defineStore('course', () => {
	const listOfCoursePages = ref<CoursePage[]>([]);

	const nextOrderIndex = computed(() => {
		return Math.max(...listOfCoursePages.value.map(course => course.order_index)) + 1;
	});

	return {
		listOfCoursePages,
		nextOrderIndex,
	};
});
