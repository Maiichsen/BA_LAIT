import type { Content as Article } from '@/types/db.ts';
import { supabase } from '@/db/connection.ts';
import { defaultArticleData } from '@/constants/courseConstants.ts';

export const createDefaultArticle = (coursePageId: string): Promise<Article> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('contents')
				.insert([
					{
						course_page_id: coursePageId,
						content_json: defaultArticleData,
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

export const getArticleByPageId = async (pageId: string): Promise<Article> => {
	const { data, error } = await supabase.from('contents').select().eq('course_page_id', pageId);

	if (error) throw error;
	if (!data || !data[0]) throw new Error('No match');

	return data[0];
};
