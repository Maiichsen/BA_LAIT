import { supabase } from '../db/connection.ts';
import {
	checkIfEmailIsAlreadyInvited,
	checkIfEmailIsAlreadyVerifiedUser,
	createInvitedUser,
} from '@/services/userService.ts';
import type { Company } from '@/types/db.ts';

const createCompany = (companyName: string): Promise<Company> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase
				.from('companies')
				.insert([{ company_name: companyName }])
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
export const createInvitedCompany = (companyName: string, companyEmail: string): Promise<Company> =>
	new Promise(async (resolve, reject) => {
		try {
			const [emailIsAlreadyInvited, emailIsAlreadyVerifiedUser] = await Promise.all([
				checkIfEmailIsAlreadyInvited(companyEmail),
				checkIfEmailIsAlreadyVerifiedUser(companyEmail),
			]);

			if (emailIsAlreadyInvited) return reject('email is already invited');
			if (emailIsAlreadyVerifiedUser) return reject('email is already used');
		} catch (err) {
			return reject(err);
		}

		createCompany(companyName)
			.then(company => {
				createInvitedUser({
					email: companyEmail,
					company_id: company.company_id,
					is_company_user: true,
				})
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
/*export const updateNewCompany = async (password: string) => {
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
};*/

/*************/
/*GET COMPANY*/
/*************/
export const getCompanyById = (companyId: string): Promise<Company> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase.from('companies').select().eq('company_id', companyId).single();

			if (error) return reject(error);

			resolve(data);
		} catch (err) {
			reject(err);
		}
	});

export const getAllCompanies = (): Promise<Company[]> =>
	new Promise(async (resolve, reject) => {
		try {
			const { data, error } = await supabase.from('companies').select('*');

			if (error) return reject(error);

			resolve(data);
		} catch (err) {
			reject(err);
		}
	});

export interface CompanyWithStats extends Company {
	courseCount: number;
	studentCount: number;
}

export const getAllCompaniesWithStats = (): Promise<CompanyWithStats[]> =>
	new Promise(async (resolve, reject) => {
		try {
			// Get all companies
			const { data: companies, error: companiesError } = await supabase.from('companies').select('*');

			if (companiesError) return reject(companiesError);

			// Get all course_seats
			const { data: seats, error: seatsError } = await supabase
				.from('course_seats')
				.select('company_id, course_id, user_id');

			if (seatsError) return reject(seatsError);

			// Aggregate stats for each company
			const companiesWithStats: CompanyWithStats[] = companies.map(company => {
				const companySeats = seats?.filter(seat => seat.company_id === company.company_id) || [];

				// Count unique courses
				const uniqueCourses = new Set(companySeats.map(seat => seat.course_id)).size;

				// Count unique users (students) - only count non-null user_ids
				const uniqueUsers = new Set(companySeats.filter(seat => seat.user_id).map(seat => seat.user_id)).size;

				return {
					...company,
					courseCount: uniqueCourses,
					studentCount: uniqueUsers,
				};
			});

			resolve(companiesWithStats);
		} catch (err) {
			reject(err);
		}
	});

export const updateCompanyNameById = (companyId: string, companyName: string): Promise<void> =>
	new Promise(async (resolve, reject) => {
		try {
			const { error } = await supabase
				.from('companies')
				.update({ company_name: companyName })
				.eq('company_id', companyId);

			if (error) return reject(error);

			resolve();
		} catch (err) {
			reject(err);
		}
	});

export const deleteCompanyById = (companyId: string): Promise<void> =>
	new Promise(async (resolve, reject) => {
		try {
			const { error } = await supabase.from('companies').delete().eq('company_id', companyId);

			if (error) return reject(error);

			resolve();
		} catch (err) {
			reject(err);
		}
	});

export interface CompanyCourseWithStats {
	course_id: string;
	title: string;
	short_course_description: string | null;
	totalSeats: number;
	usedSeats: number;
	availableSeats: number;
}

export const getCoursesByCompanyId = async (companyId: string): Promise<CompanyCourseWithStats[]> => {
	// Get all course_seats for this company with course details
	const { data: seats, error: seatsError } = await supabase
		.from('course_seats')
		.select('course_id, user_id, courses(course_id, title, short_course_description)')
		.eq('company_id', companyId);

	if (seatsError) throw seatsError;

	// Group by course and calculate stats
	const courseMap = new Map<string, CompanyCourseWithStats>();

	seats?.forEach(seat => {
		const course = seat.courses;
		if (!course || typeof course !== 'object' || !('course_id' in course)) return;

		if (!courseMap.has(course.course_id)) {
			courseMap.set(course.course_id, {
				course_id: course.course_id,
				title: course.title,
				short_course_description: course.short_course_description,
				totalSeats: 0,
				usedSeats: 0,
				availableSeats: 0,
			});
		}

		const courseStats = courseMap.get(course.course_id)!;
		courseStats.totalSeats++;
		if (seat.user_id) {
			courseStats.usedSeats++;
		}
	});

	// Calculate available seats
	const coursesWithStats = Array.from(courseMap.values()).map(course => ({
		...course,
		availableSeats: course.totalSeats - course.usedSeats,
	}));

	return coursesWithStats;
};
