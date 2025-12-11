import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { CoursePage } from '@/types/db.ts';
import { createCoursePage, getAllCoursePagesByCourseId } from '@/services/courseService.ts';
import {
	CoursePageType,
	DefaultCoursePageName,
	pageOrderIndexDefaultGab,
} from '@/constants/courseConstants.ts';
import type { RichCoursePage } from '@/types/courseTypes.ts';

export const useCourseEditorStore = defineStore('courseEditor', () => {
	const courseGlobalLoading = ref(false);
	const currentEditedCourseId = ref('');
	const currentEditedCoursePageId = ref<string | null>(null);
	const _unsortedListOfCoursePages = ref<CoursePage[]>([]);
	const coursePageContent = ref<Record<string, RichCoursePage>>({});

	const listOfCoursePages = computed(() => {
		return _unsortedListOfCoursePages.value.sort((a, b) => a.order_index - b.order_index);
	});

	const loadCourse = (courseId: string) => {
		courseGlobalLoading.value = true;
		_unsortedListOfCoursePages.value = [];
		currentEditedCourseId.value = courseId;
		currentEditedCoursePageId.value = '';

		getAllCoursePagesByCourseId(courseId)
			.then(coursePages => {
				_unsortedListOfCoursePages.value = coursePages;

				// Map each fetched page meta-data to object that can hold their page content
				coursePageContent.value = coursePages.reduce<Record<string, RichCoursePage>>((lookupSet, page) => {
					lookupSet[page.course_page_id] = {
						...page,
						contentType: CoursePageType.UNKNOWN,
						content: null,
					};
					return lookupSet;
				}, {});
			})
			.catch(err => {
				console.log(err);
			})
			.finally(() => {
				courseGlobalLoading.value = false;
			});
	};

	const _getNewOrderIndexAfterPageId = (pageId: string | null): number => {
		const currentPageListIndex = pageId
			? listOfCoursePages.value.findIndex((page) => page.course_page_id === pageId)
			: -1;

		if (currentPageListIndex === listOfCoursePages.value.length - 1) {
			// This page is the last page, so insert page after last page

			if (currentPageListIndex === -1) {
				// There are no pages yet. Insert first page
				return pageOrderIndexDefaultGab;
			}
			return listOfCoursePages.value[listOfCoursePages.value.length - 1]!.order_index + pageOrderIndexDefaultGab;
		}

		const isFirstPage = currentPageListIndex === -1;
		const orderIndexBeforeNewPage = isFirstPage ? 0 : listOfCoursePages.value[currentPageListIndex]!.order_index;
		const orderIndexAfterNewPage = listOfCoursePages.value[currentPageListIndex + 1]!.order_index;

		const newPageOrderIndex = Math.floor((orderIndexBeforeNewPage + orderIndexAfterNewPage) / 2);

		if (newPageOrderIndex === orderIndexBeforeNewPage) {
			// Indexes are too close to fit a new page in between. Move all indexes for this course
			console.log('MOVE INDEXES OF ALL PAGES IN THIS COURSE');
			return 10000;
		}

		return newPageOrderIndex;
	};

	const _addNewCoursePage = (contentType: CoursePageType.QUIZ | CoursePageType.ARTICLE): Promise<CoursePage> => new Promise((resolve, reject) => {
		const newOrderIndex = _getNewOrderIndexAfterPageId(currentEditedCoursePageId.value);

		createCoursePage(DefaultCoursePageName[contentType], currentEditedCourseId.value, newOrderIndex)
			.then(coursePage => {
				// TODO: INSERT NEW DEFAULT PAGE CONTENT OR DEFAULT QUIZ CONTENT

				_unsortedListOfCoursePages.value.push(coursePage);

				coursePageContent.value[coursePage.course_page_id] = {
					...coursePage,
					contentType: contentType,
					content: null,
					// TODO: INSERT PAGE CONTENT
				};

				resolve(coursePage);
			})
			.catch(err => {
				reject(err);
			});
	});

	const setCurrentEditedCoursePage = (pageId?: string) => {
		currentEditedCoursePageId.value = pageId ?? null;
	};

	const addNewPageTypeArticle = () => {
		return _addNewCoursePage(CoursePageType.ARTICLE);
	};

	const addNewPageTypeQuiz = () => {
		return _addNewCoursePage(CoursePageType.QUIZ);
	};

	return {
		listOfCoursePages,
		courseGlobalLoading,
		currentEditedCourseId,
		coursePageContent,
		loadCourse,
		setCurrentEditedCoursePage,
		addNewPageTypeArticle,
		addNewPageTypeQuiz,
	};
});
