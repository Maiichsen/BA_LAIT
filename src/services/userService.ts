import {supabase} from '../db/connection.ts';
import type {InvitedUser, User} from '@/types/db.ts';
import type {AuthResponse, User as AuthUser} from '@supabase/supabase-js';
import type {inviteUserParams, newUserParams, SignInResponse} from '@/types/userTypes.ts';

/*************/
/*CREATE USER*/
/*************/
export const createUser = (newUserParams: newUserParams): Promise<User> => new Promise(async (resolve, reject) => {
	try {
		const {data, error} = await supabase
			.from('users')
			.insert({
				company_id: newUserParams.company_id,
				email: newUserParams.email,
				first_name: newUserParams.first_name,
				is_company_user: newUserParams.is_company_user,
				last_name: newUserParams.last_name,
				user_id: newUserParams.user_id,
				is_admin: false,
			})
			.select()
			.single();

		if (error) return reject(error);
		await deleteInvitedUser(newUserParams.email);
		return resolve(data);
	} catch (error) {
		reject(error);
	}
});

export const getUserById = (userId: string): Promise<User> => new Promise(async (resolve, reject) => {
	try {
		const {data, error} = await supabase
			.from('users')
			.select('*')
			.eq('user_id', userId)
			.single();

		if (error) return reject(error);
		return resolve(data);
	} catch (error) {
		reject(error);
	}
});

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
/*export const supabaseSignUpNewUser = async (email: string, password: string) => {
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
};*/
export const sendSignInOtpMail = (email: string): Promise<void> =>
	new Promise(async (resolve, reject) => {
		try {
			const {error} = await supabase.auth.signInWithOtp({
				email: email,
				options: {
					emailRedirectTo: `${import.meta.env.VITE_HOST_URL}/opret`,
				},
			});

			if (error) return reject(error);

			resolve();
		} catch (err) {
			reject(err);
		}
	});

export const deleteInvitedUser = async (email: string) => {
	try {
		const {
			data,
			error,
		} = await supabase.from('invited_users').delete().eq('user_email', email.toLowerCase());

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

/************/
/*LOGIN USER*/
/************/
export const signInUser = (email: string, password: string): Promise<SignInResponse> => new Promise(async (resolve, reject) => {
	try {
		const {data, error} = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) return reject(error);
		resolve(data);
	} catch (error) {
		reject(error);
	}
});

/************/
/*AUTH STUFF*/
/************/
export const getAuthUser = (): Promise<AuthUser> => new Promise(async (resolve, reject) => {
	try {
		const {data, error} = await supabase.auth.getUser();
		if (error) return reject(error);
		if (!data || !data.user) return reject('User doesn\'t exist');
		resolve(data.user);
	} catch (error) {
		reject(error);
	}
});

/*************/
/*UPDATE USER*/
/*************/
export const updateAuthUserPassword = (password: string) => new Promise(async (resolve, reject) => {
	try {
		const {data, error} = await supabase.auth
			.updateUser({password: password});

		if (error) return reject(error);
		resolve(data);
	} catch (error) {
		console.log(error);
	}
});


export const updateFirstnameAndLastName = async (firstname: string, lastname: string) => {
	try {
		const userData = await getAuthUser();
		if (!userData) throw new Error('no user data');
		if (!userData) throw new Error('no user');

		const {data, error} = await supabase
			.from('users')
			.update({
				first_name: firstname,
				last_name: lastname,
			})
			.eq('user_id', userData.id);

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

/*TODO: hvis der er en user med samme email inviteret allerede, slet den gamle og sæt den nye ind*/
export const createInvitedUser = (inviteUserParams: inviteUserParams): Promise<InvitedUser> =>
	new Promise(async (resolve, reject) => {
		try {
			const {data, error} = await supabase
				.from('invited_users')
				.insert({
					company_id: inviteUserParams.company_id,
					user_email: inviteUserParams.email.toLowerCase(),
					is_company_user: inviteUserParams.is_company_user,
					first_name: inviteUserParams.first_name ?? null,
					last_name: inviteUserParams.last_name ?? null,
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
			const {data, error} = await supabase
				.from('invited_users')
				.select()
				.eq('user_email', email.toLowerCase());

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
			const {data, error} = await supabase
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
			const {
				data,
				error,
			} = await supabase.from('users').select('user_id').eq('email', email.toLowerCase());

			if (error) return reject(error);

			resolve(data.length > 0);
		} catch (err) {
			reject(err);
		}
	});
