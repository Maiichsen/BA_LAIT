import {supabase} from '../db/connection.ts';
import {
	createInvitedUser,
	deleteInvitedUser,
	getAuthUser,
	getInvitedUser,
	supabaseSendLoginMail,
	updateAuthUserPassword,
} from '@/services/userService.ts';
import type {Company} from '@/types/db.ts';

export const createCompany = (companyName: string): Promise<Company> => new Promise(async (resolve, reject) => {
	try {
		const {data, error} = await supabase
			.from('companies')
			.insert([
				{company_name: companyName},
			])
			// To get the created company returned, if needed
			.select();

		if (error) return reject(error);
		if (!data || !data[0]) return reject('error creating new company. Got null');

		resolve(data[0]);
	} catch (err) {
		reject(err);
	}
});

/****************/
/*INVITE COMPANY*/
/****************/
export const createInvitedCompany = (companyName: string, companyEmail: string): Promise<Company> => new Promise(async (resolve, reject) => {
	createCompany(companyName)
		.then(company => {
			createInvitedUser(companyEmail, company.company_id, true)
				.then(() => {
					resolve(company);
				})
				.catch(err => reject(err));
		})
		.catch(err => reject(err));
});

/****************/
/*CREATE COMPANY*/
/****************/
/*export const createCompany = async (userId: string, email: string) => {
	try {
		const invitedUser = await getInvitedUser(email);
		if (!invitedUser || invitedUser?.length === 0) throw new Error('User is not invited');

		const {data, error} = await supabase
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
};*/

/****************/
/*UPDATE COMPANY*/
/****************/
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

/*************/
/*GET COMPANY*/
/*************/
export const getCompanyById = (companyId: string): Promise<Company> => new Promise(async (resolve, reject) => {
	try {
		const {data, error} = await supabase
			.from('companies')
			.select()
			.eq('company_id', companyId)
			.single();

		if (error) return reject(error);

		resolve(data);
	} catch (err) {
		reject(err);
	}
});

export const getAllCompanies = (): Promise<Company[]> => new Promise(async (resolve, reject) => {
	try {
		const {data, error} = await supabase
			.from('companies')
			.select('*');

		if (error) return reject(error);

		resolve(data);
	} catch (err) {
		reject(err);
	}
});

export const updateCompanyNameById = async (companyId: string, companyName: string) => {
	try {
		const {data, error} = await supabase
			.from('companies')
			.update({company_name: companyName})
			.eq('company_id', companyId);

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const deleteCompanyById = (companyId: string): Promise<void> => new Promise(async (resolve, reject) => {
	try {
		const {error} = await supabase
			.from('companies')
			.delete()
			.eq('company_id', companyId);

		if (error) return reject(error);

		resolve();
	} catch (err) {
		reject(err);
	}
});
