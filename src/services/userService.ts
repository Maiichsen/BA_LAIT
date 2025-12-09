import { supabase } from '../db/connection.ts';

/*EMAIL STUFF*/
/*EMAIL STUFF*/
/*EMAIL STUFF*/
export const supabaseSendLoginMail = async (email: string) => {
	try {
		const { error } = await supabase.auth.signInWithOtp({
			email: email,
			options: {
				/*shouldCreateUser: false, means "do not create a user", but the link only works on users that exists in auth*/
				emailRedirectTo: 'http://localhost:5173/opret',
			},
		});
		if (error) throw error;
		return true;
	} catch (err) {
		console.log(err);
	}
};

/*CREATING AUTH USERS*/
/*CREATING AUTH USERS*/
/*CREATING AUTH USERS*/
export const checkIfUserExists = async (email: string) => {
	try {
		const { data, error } = await supabase.from('users').select('user_id').eq('email', email.toLowerCase());

		if (error) throw error;
		return data;
	} catch (err) {
		console.log(err);
	}
};

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

export const getInvitedUser = async (email: string) => {
	try {
		const { data, error } = await supabase.from('invited_users').select().eq('user_email', email.toLowerCase());

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
