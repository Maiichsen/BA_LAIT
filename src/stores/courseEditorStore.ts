import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { CoursePage } from '@/types/db.ts';
import {
	createCoursePageWithDefaultContent,
	getAllCoursePagesByCourseId,
	getCourseContentByPageId,
} from '@/services/courseService.ts';
import { CoursePageType, pageOrderIndexDefaultGab } from '@/constants/courseConstants.ts';
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

	const courseHasAnyUnsavedChanges = computed(() => {
		return Object.values(coursePageContent.value).some(page => page.hasUnsavedData === true);
	});

	const loadCourse = (courseId: string) => {
		courseGlobalLoading.value = true;
		_unsortedListOfCoursePages.value = [];
		currentEditedCourseId.value = courseId;
		currentEditedCoursePageId.value = '';
		coursePageContent.value = {};

		getAllCoursePagesByCourseId(courseId)
			.then(coursePages => {
				_unsortedListOfCoursePages.value = coursePages;

				// Map each fetched page meta-data to object that can hold their page content
				coursePageContent.value = coursePages.reduce<Record<string, RichCoursePage>>((lookupSet, page) => {
					lookupSet[page.course_page_id] = {
						...page,
						contentType: CoursePageType.unknown,
						content: null,
						hasUnsavedData: false,
					};
					return lookupSet;
				}, {});

				// If page is reloaded on an existing page, fetch that page's content when the course meta-data is fetched
				if (currentEditedCoursePageId.value) {
					_loadPageContent(currentEditedCoursePageId.value);
				}
			})
			.catch(err => {
				console.log(err);
			})
			.finally(() => {
				courseGlobalLoading.value = false;
			});
	};

	const _loadPageContent = async (pageId: string) => {
		if (!coursePageContent.value[pageId]) return;

		// This page's content is already fetched and stored locally. Don't fetch again
		if (coursePageContent.value[pageId].content) return;

		await getCourseContentByPageId(pageId)
			.then(pageContent => {
				if (!coursePageContent.value[pageId]) return;

				coursePageContent.value[pageId].contentType = pageContent.contentType;
				coursePageContent.value[pageId].content = pageContent.content;
			})
			.catch(error => console.log(error));
	};

	const _getNewOrderIndexAfterPageId = (pageId: string | null): number => {
		const currentPageListIndex = pageId
			? listOfCoursePages.value.findIndex(page => page.course_page_id === pageId)
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
			return listOfCoursePages.value[listOfCoursePages.value.length - 1]!.order_index + pageOrderIndexDefaultGab;
		}

		return newPageOrderIndex;
	};

	const _addNewCoursePage = (contentType: CoursePageType.quiz | CoursePageType.article): Promise<CoursePage> =>
		new Promise((resolve, reject) => {
			const newOrderIndex = _getNewOrderIndexAfterPageId(currentEditedCoursePageId.value);

			createCoursePageWithDefaultContent(contentType, currentEditedCourseId.value, newOrderIndex)
				.then(coursePage => {
					_unsortedListOfCoursePages.value.push(coursePage);

					coursePageContent.value[coursePage.course_page_id] = {
						...coursePage,
						contentType: contentType,
						content: coursePage.content,
					};

					resolve(coursePage);
				})
				.catch(err => {
					reject(err);
				});
		});

	const setCurrentEditedCoursePage = (pageId?: string) => {
		currentEditedCoursePageId.value = pageId ?? null;

		if (pageId) {
			_loadPageContent(pageId);
		}
	};

	const addNewPageTypeArticle = () => {
		return _addNewCoursePage(CoursePageType.article);
	};

	const addNewPageTypeQuiz = () => {
		return _addNewCoursePage(CoursePageType.quiz);
	};

	const setPageVisibility = (pageId: string, setToVisible: boolean) => {
		// TODO: Set value in db. Only set here when applied successfully
		_unsortedListOfCoursePages.value = _unsortedListOfCoursePages.value.map(page =>
			page.course_page_id === pageId
				? { ...page, is_visible: setToVisible }
				: page,
		);
	};

	const setPageHasUnsavedChange = (pageId: string, hasUnsavedChange: boolean) => {
		if (!coursePageContent.value[pageId]) return;

		coursePageContent.value[pageId].hasUnsavedData = hasUnsavedChange;
	};

	return {
		listOfCoursePages,
		courseGlobalLoading,
		currentEditedCourseId,
		coursePageContent,
		courseHasAnyUnsavedChanges,
		loadCourse,
		setCurrentEditedCoursePage,
		addNewPageTypeArticle,
		addNewPageTypeQuiz,
		setPageVisibility,
		setPageHasUnsavedChange,
	};
});
