import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {CoursePage} from '@/types/db.ts';
import {createCoursePage, getAllCoursePagesByCourseId} from '@/services/courseService.ts';
import {pageOrderIndexDefaultGab} from '@/constants/courseConstants.ts';
import type {RichCoursePage} from '@/types/courseTypes.ts';

export const useCourseEditorStore = defineStore('courseEditor', () => {
	const courseGlobalLoading = ref(false);
	const currentEditedCourseId = ref('');
	const currentEditedCoursePageId = ref<string | null>(null);
	const unsortedListOfCoursePages = ref<CoursePage[]>([]);
	const coursePageContent = ref<Record<string, RichCoursePage>>({});

	const listOfCoursePages = computed(() => {
		return unsortedListOfCoursePages.value.sort((a, b) => a.order_index - b.order_index);
	});

	const loadCourse = (courseId: string) => {
		courseGlobalLoading.value = true;
		unsortedListOfCoursePages.value = [];
		currentEditedCourseId.value = courseId;
		currentEditedCoursePageId.value = '';

		getAllCoursePagesByCourseId(courseId)
			.then(coursePages => {
				unsortedListOfCoursePages.value = coursePages;

				coursePageContent.value = coursePages.reduce<Record<string, RichCoursePage>>((lookupSet, page) => {
					lookupSet[page.course_page_id] = {
						...page,
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

	const getNewOrderIndexAfterPageId = (pageId: string | null): number => {
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

	const addNewCoursePage = (): Promise<CoursePage> => new Promise((resolve, reject) => {
		const newOrderIndex = getNewOrderIndexAfterPageId(currentEditedCoursePageId.value);

		let tempPageName = generateTemporaryRandomName();
		if (Math.random() > 0.5) {
			tempPageName += ` ${generateTemporaryRandomName()}`;

			if (Math.random() > 0.5) {
				tempPageName += ` ${generateTemporaryRandomName()}`;
			}
		}

		createCoursePage(/*'Ny side*'´*/ tempPageName, currentEditedCourseId.value, newOrderIndex)
			.then(coursePage => {
				unsortedListOfCoursePages.value.push(coursePage);

				coursePageContent.value[coursePage.course_page_id] = {
					...coursePage,
					content: null,
				};

				resolve(coursePage);
			})
			.catch(err => {
				reject(err);
			});
	});

	const generateTemporaryRandomName = (): string => {
		const tempRandomName = Array.from({length: Math.floor(2 + Math.random() * 4)}, () =>
			String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
		return tempRandomName[0]!.toUpperCase() + tempRandomName.slice(1);
	};

	const setCurrentEditedCoursePage = (pageId?: string) => {
		currentEditedCoursePageId.value = pageId ?? null;
	};

	return {
		listOfCoursePages,
		courseGlobalLoading,
		currentEditedCourseId,
		coursePageContent,
		loadCourse,
		addNewCoursePage,
		setCurrentEditedCoursePage,
	};
});
