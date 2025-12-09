import { supabase } from '../db/connection.ts';
import type { NewCourseParams, CourseParams } from '../types/courseTypes.ts';
import type { Content, Course, CoursePage } from '../types/db.ts';
import { defaultPageContent } from '../constants/courseConstants.ts';
import { downloadImageFromSupabaseBucket } from './imageService.ts';

export const createTemplateCourse = (): Promise<Course> =>
	new Promise(async (resolve, reject) => {
		createCourse({
			title: 'Nyt kurses',
			short_course_description: 'Kort beskrivelse af kurset',
		})
			.then(course => {
				createCoursePage('Side 1', course.course_id, 1)
					.then(page => {
						createNewPageContent(page.course_page_id)
							.then(() => {
								resolve(course);
							})
							.catch(() => reject('error creating page content'));
					})
					.catch(() => reject('error creating empty page'));
			})
			.catch(() => reject('error creating new course'));
	});

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

export const updateCourse = async (courseId: string, updateCourseParams: CourseParams) => {
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
			.select();

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const getCourseById = (courseId: string): Promise<Course> =>
	new Promise(async (resolve, reject) => {
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
export const createCoursePage = (title: string, courseId: string, orderIndex: number): Promise<CoursePage> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('course_pages')
				.insert([
					{
						course_id: courseId,
						course_page_title: title,
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

export const createNewPageContent = (coursePageId: string): Promise<Content> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('contents')
				.insert([
					{
						course_page_id: coursePageId,
						content_json: defaultPageContent,
					},
				])
				.select();

			if (error) return reject(error);
			if (!data || !data[0]) return reject('error creating page content. Got null');

			resolve(data[0]);
		} catch (err) {
			reject(err);
		}
	});
