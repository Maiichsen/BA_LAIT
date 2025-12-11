export const defaultPageContent = {
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
	UNKNOWN,
	ARTICLE,
	QUIZ,
}

export const DefaultCoursePageName: Record<CoursePageType, string> = {
	[CoursePageType.UNKNOWN]: '',
	[CoursePageType.ARTICLE]: 'Ny side',
	[CoursePageType.QUIZ]: 'Ny quiz',
};
