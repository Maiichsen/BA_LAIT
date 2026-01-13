import { supabase } from '../db/connection.ts';
import {
	NewCourseParams,
	CourseParams,
	RichCoursePage,
	CoursePageContent,
	ContentWithText,
} from '../types/courseTypes.ts';
import type { Course, CoursePage } from '../types/db.ts';
import { CoursePageType, DefaultCoursePageName, pageOrderIndexDefaultGab } from '../constants/courseConstants.ts';
import { downloadImageFromSupabaseBucket } from './imageService.ts';
import { createDefaultArticle, getArticleByPageId } from '@/services/courseArticleService.ts';
import { createDefaultQuiz, getQuizByPageId } from '@/services/quizService.ts';

export const createTemplateCourse = async (): Promise<Course> => {
	const course = await createCourse({
		title: 'Nyt kurses',
		short_course_description: 'Kort beskrivelse af kurset',
	});
	await createCoursePageWithDefaultContent(CoursePageType.article, course.course_id, pageOrderIndexDefaultGab);
	return course;
};

/*new Promise(async (resolve, reject) => {
	createCourse({
		title: 'Nyt kurses',
		short_course_description: 'Kort beskrivelse af kurset',
	})
		.then(course => {
			createCoursePage(DefaultCoursePageName[CoursePageType.article], course.course_id, pageOrderIndexDefaultGab)
				.then(page => {
					createNewPageArticle(page.course_page_id)
						.then(() => {
							resolve(course);
						})
						.catch(() => reject('error creating page content'));
				})
				.catch(() => reject('error creating empty page'));
		})
		.catch(() => reject('error creating new course'));
});*/

export const createCourse = (newCourseParams: NewCourseParams): Promise<Course> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('courses')
				.insert([
					{
						title: newCourseParams.title,
						short_course_description: newCourseParams.short_course_description,
					},
				])
				.select();

			if (error) return reject(error);
			if (!data || !data[0]) return reject('Encountered an error creating course. Got null');

			resolve(data[0]);
		} catch (err) {
			reject(err);
		}
	});

export const updateCourse = (courseId: string, updateCourseParams: CourseParams): Promise<Course> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('courses')
				.update({
					long_course_description: updateCourseParams.long_course_description,
					short_course_description: updateCourseParams.short_course_description,
					cover_image_url: updateCourseParams.cover_image_url,
					estimated_time_minutes: updateCourseParams.estimated_time_minutes,
					title: updateCourseParams.title,
					author_name: updateCourseParams.author_name,
				})
				.eq('course_id', courseId)
				.select()
				.single();

			if (error) return reject(error);

			resolve(data);
		} catch (err) {
			reject(err);
		}
	});

export const getCourseById = (courseId: string): Promise<Course> =>
	new Promise(async (resolve, reject) => {
		if (!courseId) return reject('CourseId is required');

		try {
			const { data, error } = await supabase.from('courses').select().eq('course_id', courseId).single();

			if (error) return reject(error);
			resolve(data);
		} catch (err) {
			reject(err);
		}
	});

export const getCoverImgFilenameByCourseId = (courseId: string): Promise<string | null> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('courses')
				.select('cover_image_url')
				.eq('course_id', courseId)
				.single();

			if (error) return reject(error);

			resolve(data.cover_image_url);
		} catch (err) {
			reject(err);
		}
	});

export const getCoverImgUrlByCourseId = (courseId: string): Promise<string | null> =>
	new Promise(async (resolve, reject) => {
		getCoverImgFilenameByCourseId(courseId)
			.then(imgFilename => {
				if (!imgFilename) return resolve(null);

				downloadImageFromSupabaseBucket('courseCovers', imgFilename)
					.then(imgUrl => {
						resolve(imgUrl);
					})
					.catch(() => reject('error fetching image from storage'));
			})
			.catch(() => reject('error fetching course with that id'));
	});

export const getAllPublicCourses = (): Promise<Course[]> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('courses')
				.select('*')
				.eq('is_published', true)
				.is('soft_deleted_at', null);

			if (error) return reject(error);

			resolve(data);
		} catch (err) {
			reject(err);
		}
	});

export const getAllCourses = (): Promise<Course[]> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase.from('courses').select('*');

			if (error) return reject(error);

			resolve(data);
		} catch (err) {
			reject(err);
		}
	});

export const getUserCourses = (userId: string): Promise<Course[]> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('course_seats')
				.select('courses(*)')
				.eq('user_id', userId);

			if (error) return reject(error);

			// Extract courses from the nested structure
			const courses = data.map(seat => seat.courses).filter(course => course !== null) as Course[];

			resolve(courses);
		} catch (err) {
			reject(err);
		}
	});

export const deleteCourseById = (courseId: string): Promise<void> =>
	new Promise(async (resolve, reject) => {
		try {
			const { error } = await supabase
				.from('courses')
				.update({ soft_deleted_at: new Date().toISOString() })
				.eq('course_id', courseId);

			if (error) return reject(error);

			resolve();
		} catch (err) {
			reject(err);
		}
	});

export const permDeleteCourseById = (courseId: string): Promise<void> =>
	new Promise(async (resolve, reject) => {
		try {
			const { error } = await supabase.from('courses').delete().eq('course_id', courseId);

			if (error) return reject(error);

			resolve();
		} catch (err) {
			reject(err);
		}
	});

///////*COURSE PAGES*////////
export const createCoursePage = (pageTitle: string, courseId: string, orderIndex: number): Promise<CoursePage> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('course_pages')
				.insert([
					{
						course_id: courseId,
						course_page_title: pageTitle,
						order_index: orderIndex,
					},
				])
				.select();

			if (error) return reject(error);
			if (!data || !data[0]) return reject('error creating course page. Got null');

			resolve(data[0]);
		} catch (err) {
			reject(err);
		}
	});

export const createCoursePageWithDefaultContent = async (
	pageType: CoursePageType,
	courseId: string,
	orderIndex: number,
): Promise<RichCoursePage> => {
	const page = await createCoursePage(DefaultCoursePageName[pageType], courseId, orderIndex);

	if (pageType === CoursePageType.article) {
		const article = (await createDefaultArticle(page.course_page_id)) as ContentWithText;
		return {
			...page,
			contentType: pageType,
			content: article,
			hasUnsavedData: false,
		};
	}

	if (pageType === CoursePageType.quiz) {
		const quiz = await createDefaultQuiz(page.course_page_id);

		return {
			...page,
			contentType: pageType,
			content: quiz,
			hasUnsavedData: false,
		};
	}

	throw new Error('Unknown page type can not be created');
};

export const setCoursePageVisibilityById = async (coursePageId: string, isVisible: boolean) => {
	try {
		const { data, error } = await supabase
			.from('course_pages')
			.update({ is_visible: isVisible })
			.eq('course_page_id', coursePageId);

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const getAllCoursePagesByCourseId = (courseId: string): Promise<CoursePage[]> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('course_pages')
				.select('*')
				.eq('course_id', courseId)
				.order('order_index', { ascending: true });

			if (error) return reject(error);
			if (!data) return reject('course pages not found');

			resolve(data);
		} catch (err) {
			reject(err);
		}
	});

export const getCourseContentByPageId = async (
	pageId: string,
): Promise<{
	content: CoursePageContent;
	contentType: CoursePageType;
}> => {
	try {
		const article = (await getArticleByPageId(pageId)) as ContentWithText;
		return { content: article, contentType: CoursePageType.article };
	} catch {
		// ignore "not found" and try quiz
	}

	try {
		const quiz = await getQuizByPageId(pageId);
		return { content: quiz, contentType: CoursePageType.quiz };
	} catch {
		throw new Error('No content found for page');
	}
};

export const getCourseStatusForUser = (
	courseId: string,
	userId: string,
): Promise<'not_started' | 'in_progress' | 'completed'> =>
	new Promise(async (resolve, reject) => {
		try {
			// Tjek om brugeren har nogen progress på dette kursus
			const { data: progressData, error: progressError } = await supabase
				.from('course_progress')
				.select('course_page_id')
				.eq('user_id', userId);

			if (progressError) return reject(progressError);

			// Hent alle sider for kurset
			const { data: pagesData, error: pagesError } = await supabase
				.from('course_pages')
				.select('course_page_id')
				.eq('course_id', courseId);

			if (pagesError) return reject(pagesError);

			if (!pagesData || pagesData.length === 0) {
				return resolve('not_started');
			}

			// Find progress for dette kursus
			const coursePageIds = pagesData.map(p => p.course_page_id);
			const completedPages = progressData?.filter(p => coursePageIds.includes(p.course_page_id)) || [];

			if (completedPages.length === 0) {
				return resolve('not_started');
			} else if (completedPages.length === pagesData.length) {
				return resolve('completed');
			} else {
				return resolve('in_progress');
			}
		} catch (err) {
			reject(err);
		}
	});
