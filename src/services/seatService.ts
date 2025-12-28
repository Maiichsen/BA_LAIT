import { supabase } from '../db/connection.ts';
import type { NewCourseSeatParams } from '../types/courseTypes.ts';

///////*COURSE PAGES*////////
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

/*CREATE CONTENT*/
/*CREATE CONTENT*/
/*CREATE CONTENT*/

///////*COURSE SEATS*////////
/*export const createCourseSeat = async (newCourseSeatParams: NewCourseSeatParams) => {
	try {
		const { data, error } = await supabase
			.from('course_seats')
			.insert([
				{
					course_id: newCourseSeatParams.course_id,
					company_id: newCourseSeatParams.company_id,
					user_id: newCourseSeatParams.user_id,
					reserved_for_email: newCourseSeatParams.reserved_for_email,
				},
			])
			.select();

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};*/

/*export const deleteCourseSeat = async (courseSeatId: string) => {
	try {
		const { error } = await supabase.from('course_seats').delete().eq('course_seat_id', courseSeatId);

		if (error) throw error;
		return true;
	} catch (err) {
		console.log(err);
	}
};*/

///////*COURSE SEATS*////////
export const createCourseSeat = async (newCourseSeatParams: NewCourseSeatParams) => {
	try {
		const { data, error } = await supabase
			.from('course_seats')
			.insert([
				{
					course_id: newCourseSeatParams.course_id,
					company_id: newCourseSeatParams.company_id,
					user_id: newCourseSeatParams.user_id,
					reserved_for_email: newCourseSeatParams.reserved_for_email,
				},
			])
			.select();

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const deleteCourseSeat = async (courseSeatId: string) => {
	try {
		const { error } = await supabase.from('course_seats').delete().eq('course_seat_id', courseSeatId);

		if (error) throw error;
		return true;
	} catch (err) {
		console.log(err);
	}
};

export const assignUserToCourseSeat = async (companyId: string, courseId: string, userId: string) => {
	try {
		// Find first available seat for this course and company
		const { data: availableSeats, error: selectError } = await supabase
			.from('course_seats')
			.select('course_seat_id')
			.eq('company_id', companyId)
			.eq('course_id', courseId)
			.is('user_id', null)
			.limit(1);

		if (selectError) throw selectError;
		if (!availableSeats || availableSeats.length === 0) {
			throw new Error('No available seats for this course');
		}

		const seatId = availableSeats[0]?.course_seat_id;
		if (!seatId) {
			throw new Error('No available seats for this course');
		}

		// Update the seat with the user_id
		const { data, error: updateError } = await supabase
			.from('course_seats')
			.update({ user_id: userId })
			.eq('course_seat_id', seatId)
			.select();

		if (updateError) throw updateError;
		return data;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

/*export const getAllUnusedCourseKeysByCompany = async (courseId: string, companyId: string) => {
  try {
    const {data, error} = await supabase
      .from('course_keys')
      .select('*')
      .eq('company_id', companyId)
      .eq('course_id', courseId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};*/

/*export const getAllUnenrolledCoursesByCompany = async (companyId: string) => {
  try {
    const {data, error} = await supabase
      .from('course_keys')
      .select('courses(*)')
      .eq('company_id', companyId);

    /!*To get list of unique courses*!/
    const uniqueCourses = Array.from(
      new Map(data?.map(item => [item.courses.course_id, item.courses])).values(),
    );

    if (error) throw error;
    return uniqueCourses;
  } catch (err) {
    console.log(err);
  }
};*/

/*export const getAllEnrolledCoursesByCompany = async (companyId: string) => {
  try {
    const {data, error} = await supabase
      .from('enrollments')
      .select('courses(*),users!inner(company_id)')
      .eq('users.company_id', companyId);

    /!*To get list of unique courses*!/
    const uniqueCourses = Array.from(
      new Map(data?.map(item => [item.courses.course_id, item.courses])).values(),
    );

    if (error) throw error;
    return uniqueCourses;
  } catch (err) {
    console.log(err);
  }
};*/

/*export const getAllCoursesByStudent = async (userId: string) => {
  try {
    const {data, error} = await supabase
      .from('enrollments')
      .select('courses(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};*/
