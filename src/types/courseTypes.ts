import type { Content, CoursePage, Quiz } from '@/types/db.ts';
import { CoursePageType } from '@/constants/courseConstants.ts';

export interface NewCourseParams {
	title: string;
	short_course_description: string;
}

export interface CourseParams {
	long_course_description: string;
	short_course_description: string;
	cover_image_url: string | null;
	estimated_time_minutes: number | null;
	title: string;
	author_name: string | null;
}

export interface NewCourseSeatParams {
	company_id: string;
	course_id: string;
	reserved_for_email: string | null;
	user_id: string | null;
}

export type JoinedQuiz = Quiz;

export type CoursePageContent = Content | JoinedQuiz;

export interface RichCoursePage extends CoursePage {
	contentType: CoursePageType,
	content: null | CoursePageContent
}
