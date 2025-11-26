import {supabase} from '../db/connection.ts';
import type {newCourseParams} from '../types/courseTypes.ts';

export const createCourse = async (newCourseParams: newCourseParams) => {
  try {
    const {data, error} = await supabase
      .from('courses')
      .insert([
        newCourseParams,
      ])
      // To get the created course returned, if needed
      .select();


    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getCourseById = async (courseId: string) => {
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

export const getAllUnenrolledCoursesByCompany = async (companyId: string) => {
  try {
    const {data, error} = await supabase
      .from('course_keys')
      .select('course:courses(*)')
      .eq('company_id', companyId);

    /*To get list of unique courses*/
    const uniqueCourses = Array.from(
      new Map(data?.map(item => [item.course.course_id, item.course])).values(),
    );

    if (error) throw error;
    return uniqueCourses;
  } catch (err) {
    console.log(err);
  }
};

export const getAllEnrolledCoursesByCompany = async (companyId: string) => {
  try {
    const {data, error} = await supabase
      .from('enrollments')
      .select('course:courses(*),users!inner(company_id)')
      .eq('users.company_id', companyId);

    const uniqueCourses = Array.from(
      new Map(data?.map(item => [item.course.course_id, item.course])).values(),
    );

    if (error) throw error;
    return uniqueCourses;
  } catch (err) {
    console.log(err);
  }
};


export const getAllCoursesByStudent = async (userId: string) => {
  try {
    const {data, error} = await supabase
      .from('enrollments')
      .select('course:courses(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteCourseById = async (courseId: string) => {
  try {
    const {error} = await supabase
      .from('courses')
      .update({soft_deleted_at: new Date().toISOString()})
      .eq('course_id', courseId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.log(err);
  }
};

export const permDeleteCourseById = async (courseId: string) => {
  try {
    const {error} = await supabase
      .from('courses')
      .delete()
      .eq('course_id', courseId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.log(err);
  }
};


///////*COURSE KEYS*////////
export const createCourseKey = async (courseId: string, companyId?: string) => {
  try {
    const {data, error} = await supabase
      .from('course_keys')
      .insert([{course_id: courseId, company_id: companyId}])
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteCourseKey = async (courseKeyId: string) => {
  try {
    const {error} = await supabase
      .from('course_keys')
      .delete()
      .eq('course__key_id', courseKeyId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.log(err);
  }
};


///////*COURSE PAGES*////////
export const createCoursePage = async (courseId: string, orderIndex: number) => {
  try {
    const {data, error} = await supabase
      .from('course_pages')
      .insert([{course_id: courseId, order_index: orderIndex}])
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const setCoursePageVisibilityById = async (coursePageId: string, isVisible: boolean) => {
  try {
    const {data, error} = await supabase
      .from('course_pages')
      .update({is_visible: isVisible})
      .eq('course_page_id', coursePageId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

///////*ENROLLMENTS*////////
export const createEnrollment = async (courseId: string, userId: string) => {
  try {
    const {data, error} = await supabase
      .from('enrollments')
      .insert([{course_id: courseId, user_id: userId}])
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};
