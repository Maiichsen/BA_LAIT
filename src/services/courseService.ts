import {supabase} from '../db/connection.ts';
import type {newCourseParams} from '@/types/courseTypes.ts';
import type {Course} from '@/types/db.ts';

export const createCourse = async (newCourseParams: newCourseParams): Course => {
  try {
    const {data, error} = await supabase
      .from('courses')
      .insert([
        newCourseParams,
      ])
      .select(); // To get the created course returned, if needed

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getCourseById = async (courseId: string): Course => {
  try {
    const {data, error} = await supabase
      .from('courses')
      .select()
      .eq('course_id', courseId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};


export const deleteCourseById = async (courseId: string): boolean => {
  try {
    const {error} = await supabase
      .from('courses')
      .delete()
      .eq('course', courseId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.log(err);
  }
};
