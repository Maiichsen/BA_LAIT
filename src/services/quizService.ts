import { supabase } from '../db/connection.ts';
import type { newQuizParams } from '@/types/quizTypes.ts';
import type { Quiz } from '@/types/db.ts';
/********/
/* QUIZ */
/********/
export const createDefaultQuiz = async (coursePageId: string): Promise<Quiz> => {
	const quiz = await createQuiz({
		course_page_id: coursePageId,
		certification_requirement: true,
		passing_percentage: null,
		title: null,
	});

	// TODO: add default quiz items

	return quiz;
};

export const getQuizByPageId = (pageId: string): Promise<Quiz> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase.from('quizzes').select().eq('course_page_id', pageId).single();

			if (error) return reject(error);

			resolve(data);
		} catch (err) {
			reject(err);
		}
	});

export const createQuiz = async (newQuizParams: newQuizParams): Promise<Quiz> => {
	try {
		const { data, error } = await supabase
			.from('quizzes')
			.insert([
				{
					certification_requirement: newQuizParams.certification_requirement,
					course_page_id: newQuizParams.course_page_id,
					passing_percentage: newQuizParams.passing_percentage,
					title: newQuizParams.title,
				},
			])
			.select();

		if (error) throw error;
		if (!data || !data[0]) throw new Error('Encountered an error creating quiz. Got null');

		return data[0];
	} catch (err) {
		throw err;
	}
};
/******************/
/* QUESTION TYPES */
/******************/
/*export const createQuestionTypes = async (title: string, description: string) => {
	try {
		const { data, error } = await supabase.from('question_types').insert([title, description]).select();

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};*/

export const getQuestionType = async (questionTypeId: string) => {
	try {
		const { data, error } = await supabase
			.from('question_types')
			.select()
			.eq('question_type_id', questionTypeId)
			.single();

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const deleteQuestionTypeById = async (questionTypeId: string) => {
	try {
		const { error } = await supabase.from('question_types').delete().eq('question_type_id', questionTypeId);

		if (error) throw error;
		return true;
	} catch (err) {
		console.log(err);
	}
};
