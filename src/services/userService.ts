import {supabase} from '../db/connection.ts';
import type {newUserParams} from '@/types/userTypes.ts';

/*export const findCompanyByRegistrationKey = async (registrationKey: string) => {
  try {
    if (!registrationKey) {
      throw new Error('registration key is missing');
    }

    const {data, error} = await supabase
      .from('companies')
      .select()
      .eq('registration_key', registrationKey)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};*/

/*export const findCourseKeyById = async (id: string) => {
  try {
    const {data, error} = await supabase
      .from('course_keys')
      .select()
      .eq('course_key_id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};*/


export const createUser = async (newUserParams: newUserParams) => {
  try {

    /* const foundCompany = await findCompanyByRegistrationKey(newUserParams.registration_key);
    if (foundCompany) {
      const {data, error} = await supabase
        .from('users')
        .insert([{
          email: newUserParams.email,
          password: newUserParams.password,
          is_company_user: true,
          company_id: foundCompany.company_id,
        }])
        .select();

      if (error) throw error;
      return data;
    }
    const foundCourseKey = await findCourseKeyById(newUserParams.registration_key);
    if (foundCourseKey) {
      const {data, error} = await supabase
        .from('users')
        .insert([{
          email: newUserParams.email,
          password: newUserParams.password,
          company_id: foundCourseKey.company_id,
        }])
        .select();

      if (error) throw error;
      return data;
    }*/

    throw new Error('Invalid registration key');

  } catch (err) {
    console.log(err);
  }
};

export const signUpNewUser = async (email: string, password: string) => {
  try {
    const {data, error} = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getUsersByCompanyAndCourseEnrollment = async (companyId: string, courseId: string) => {
  try {
    const {data, error} = await supabase
      .from('users')
      .select(`
      user_id,
      email,
      company_id,
      first_name,
      last_name,
      enrollments!inner(course_id)`)
      .eq('company_id', companyId)
      .eq('enrollments.course_id', courseId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};
