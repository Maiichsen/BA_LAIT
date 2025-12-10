import { supabase } from '../db/connection.ts';
import type { InvitedUser } from '@/types/db.ts';

/*EMAIL STUFF*/
/*EMAIL STUFF*/
/*EMAIL STUFF*/
export const sendSignInOtpMail = (email: string): Promise<void> =>
	new Promise(async (resolve, reject) => {
		try {
			const { error } = await supabase.auth.signInWithOtp({
				email: email,
				options: {
					/*shouldCreateUser: false, means "do not create a user", but the link only works on users that exists in auth*/
					emailRedirectTo: `${import.meta.env.VITE_HOST_URL}/opret`,
				},
			});

			if (error) return reject(error);

			resolve();
		} catch (err) {
			reject(err);
		}
	});

/*CREATING AUTH USERS*/
/*CREATING AUTH USERS*/
/*CREATING AUTH USERS*/
/*export const checkIfUserExists = async (email: string) => {
	try {
		const {
			data,
			error
		} = await supabase.from('users').select('user_id').eq('email', email.toLowerCase());

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};*/

export const supabaseSignUpNewUser = async (email: string, password: string) => {
	try {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const deleteInvitedUser = async (email: string) => {
	try {
		const { data, error } = await supabase.from('invited_users').delete().eq('user_email', email.toLowerCase());

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

/*LOGIN USER*/
/*LOGIN USER*/
/*LOGIN USER*/
export const signInUser = async (email: string, password: string) => {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

/*AUTH STUFF*/
export const getAuthUser = async () => {
	try {
		const { data, error } = await supabase.auth.getUser();

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

/*UPDATE USER*/
/*UPDATE USER*/
/*UPDATE USER*/
export const updateAuthUserPassword = async (password: string) => {
	try {
		const { data, error } = await supabase.auth.updateUser({
			password: password,
		});

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const updateFirstnameAndLastName = async (firstname: string, lastname: string) => {
	try {
		const userData = await getAuthUser();
		if (!userData) throw new Error('no user data');
		if (!userData.user) throw new Error('no user');

		const { data, error } = await supabase
			.from('users')
			.update({
				first_name: firstname,
				last_name: lastname,
			})
			.eq('user_id', userData.user?.id);

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const createInvitedUser = (email: string, companyId: string, isCompanyOwner: boolean): Promise<InvitedUser> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('invited_users')
				.insert({
					company_id: companyId,
					user_email: email.toLowerCase(),
					is_company_user: isCompanyOwner,
				})
				.select();

			if (error) return reject(error);
			if (!data || !data[0]) return reject('No data object found, lost in space');

			const user = data[0];

			sendSignInOtpMail(user.user_email)
				.then(() => resolve(user))
				.catch(() => reject('Error sending verification e-mail'));
		} catch (err) {
			reject(err);
		}
	});

export const getInvitedUserByEmail = (email: string): Promise<InvitedUser | null> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase.from('invited_users').select().eq('user_email', email.toLowerCase());

			if (error) return reject(error);
			if (!data) return reject('No data object found, lost in space');
			if (!data[0]) return resolve(null);

			resolve(data[0]);
		} catch (err) {
			reject(err);
		}
	});

export const checkIfEmailIsAlreadyInvited = (email: string): Promise<boolean> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('invited_users')
				.select('invited_user_id')
				.eq('user_email', email.toLowerCase());

			if (error) return reject(error);

			resolve(data.length > 0);
		} catch (err) {
			reject(err);
		}
	});

export const checkIfEmailIsAlreadyVerifiedUser = (email: string): Promise<boolean> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase.from('users').select('user_id').eq('email', email.toLowerCase());

			if (error) return reject(error);

			resolve(data.length > 0);
		} catch (err) {
			reject(err);
		}
	});
