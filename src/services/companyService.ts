import { supabase } from '../db/connection.ts';
import {
	deleteInvitedUser,
	getAuthUser,
	getInvitedUser,
	supabaseSendLoginMail,
	updateAuthUserPassword,
	updateFirstnameAndLastName,
} from '@/services/userService.ts';
import { createStudent } from '@/services/studentService.ts';

/*export const createCompany = async (companyName: string) => {
  try {
    const {data, error} = await supabase
      .from('companies')
      .insert([
        {company_name: companyName},
      ])
      // To get the created company returned, if needed
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};*/

/*INVITE COMPANY*/
/*INVITE COMPANY*/
export const createInvitedCompany = async (email: string, companyId: string) => {
	console.log(email);
	console.log(companyId);
	try {
		const { data, error } = await supabase
			.from('invited_users')
			.insert({
				company_id: companyId,
				user_email: email,
				is_company_user: true,
			})
			.select();

		if (error) throw error;
		if (!data) throw new Error('No data object found, lost in space');

		return await supabaseSendLoginMail(data[0].user_email);
	} catch (err) {
		console.log(err);
	}
};

/*CREATE COMPANY*/
/*CREATE COMPANY*/
export const createCompany = async (userId: string, email: string) => {
	try {
		const invitedUser = await getInvitedUser(email);
		if (!invitedUser || invitedUser?.length === 0) throw new Error('User is not invited');

		const { data, error } = await supabase
			.from('users')
			.insert({
				user_id: userId,
				company_id: invitedUser[0].company_id,
				email: email,
			})
			.select();

		if (error) throw error;
		await deleteInvitedUser(email);
		return data;
	} catch (err) {
		console.log(err);
	}
};

/*UPDATE COMPANY*/
/*UPDATE COMPANY*/
export const updateNewCompany = async (password: string) => {
	try {
		const authUser = await getAuthUser();
		if (!authUser) throw new Error('no user data');
		if (!authUser.user || !authUser.user.email) throw new Error('no user found');

		await createCompany(authUser.user.id, authUser.user.email);

		await Promise.all([updateAuthUserPassword(password)]);

		return true;
	} catch (err) {
		console.log(err);
	}
};

/*GET COMPANY*/
/*GET COMPANY*/
export const getCompanyById = async (companyId: string) => {
	try {
		const { data, error } = await supabase.from('companies').select().eq('company_id', companyId).single();

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const getAllCompanies = async () => {
	try {
		const { data, error } = await supabase.from('companies').select('*');

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const updateCompanyNameById = async (companyId: string, companyName: string) => {
	try {
		const { data, error } = await supabase
			.from('companies')
			.update({ company_name: companyName })
			.eq('company_id', companyId);

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const deleteCompanyById = async (companyId: string) => {
	try {
		const { data, error } = await supabase.from('companies').delete().eq('company_id', companyId);

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};
