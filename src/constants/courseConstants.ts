export const defaultArticleData = {
	backgroundColor: 'ADD8E6',
	content: [
		{
			type: 'text',
			data: '## Here is my text\nI have headers and normal text. This format will change',
		},
		{
			type: 'image',
			data: {
				src: 'https://i.pinimg.com/474x/33/77/af/3377af1655bc53afcbe5f99c00ab3f25.jpg',
				alt: 'Tired cat',
			},
		},
	],
	temp_raw_text: 'Ny side',
};

export const pageOrderIndexDefaultGab = 64;

// ES-lint says these are unused even when they are literally used 3 lines below
export enum CoursePageType {
	// eslint-disable-next-line
	unknown,
	// eslint-disable-next-line
	article,
	// eslint-disable-next-line
	quiz,
}

export const DefaultCoursePageName: Record<CoursePageType, string> = {
	[CoursePageType.unknown]: '',
	[CoursePageType.article]: 'Ny side',
	[CoursePageType.quiz]: 'Ny quiz',
};
