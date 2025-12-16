export const defaultArticleData = {
	backgroundColor: 'ADD8E6',
	content: [
		{
			type: 'h1',
			text: 'Ny side',
		},
		{
			type: 'p',
			text: 'Indhold',
		},
	],
};

export const pageOrderIndexDefaultGab = 64;

export enum CoursePageType {
	unknown,
	article,
	quiz,
}

export const DefaultCoursePageName: Record<CoursePageType, string> = {
	[CoursePageType.unknown]: '',
	[CoursePageType.article]: 'Ny side',
	[CoursePageType.quiz]: 'Ny quiz',
};
