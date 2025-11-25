import {supabase} from '../db/connection.ts';


/////////*QUESTION TYPES*/////////
export const createQuestionTypes = async (title: string, description: string) => {
  try {
    const {data, error} = await supabase
      .from('question_types')
      .insert([title, description])
      .select(); // To get the created question type returned, if needed

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getQuestionType = async (questionTypeId: string) => {
  try {
    const {data, error} = await supabase
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
    const {error} = await supabase
      .from('question_types')
      .delete()
      .eq('question_type_id', questionTypeId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.log(err);
  }
};
