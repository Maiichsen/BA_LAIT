import { supabase } from '@/db/connection.ts';
import { deleteInvitedUser, getInvitedUserByEmail, sendSignInOtpMail } from '@/services/userService.ts';
import type { User } from '@/types/db.ts';

export interface InviteStudentParams {
	email: string;
	companyId: string;
	firstName?: string;
	lastName?: string;
}

export const createInvitedStudent = async (params: InviteStudentParams): Promise<void> => {
	const { data, error } = await supabase
		.from('invited_users')
		.insert({
			company_id: params.companyId,
			user_email: params.email.toLowerCase(),
			first_name: params.firstName || null,
			last_name: params.lastName || null,
			is_company_user: false,
		})
		.select()
		.single();

	if (error) throw error;
	if (!data) throw new Error('No data object found, lost in space');

	await sendSignInOtpMail(data.user_email);
};

/*Not in use currently, due to maigc link creating user*/
/*export const createAuthStudent = async (email: string, password: string) => {
  try {
    const userList = await checkIfUserExists(email);
    if (userList && userList.length > 0) throw new Error('user already exists');

    const invitedUser = await getInvitedUser(email);
    if (!invitedUser || invitedUser?.length === 0) throw new Error('User is not invited');

    const authData = await supabaseSignUpNewUser(email, password);
    if (!authData) throw new Error('no auth data created');
    if (!authData.user) throw new Error('no auth user created');

    const {data, error} = await supabase
      .from('users')
      .insert({
        user_id: authData.user.id,
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

export const createStudent = async (userId: string, email: string): Promise<User> => {
	const invitedUser = await getInvitedUserByEmail(email);
	if (!invitedUser) throw new Error('Invited User not found');

	const { data, error } = await supabase
		.from('users')
		.insert({
			user_id: userId,
			company_id: invitedUser.company_id,
			email: email,
		})
		.select()
		.single();

	if (error) throw error;
	await deleteInvitedUser(email);
	return data;
};

export interface StudentWithStats {
	user_id: string;
	email: string;
	first_name: string | null;
	last_name: string | null;
	company_id: string | null;
	company_name: string;
	courseCount: number;
	status: 'Aktiv' | 'Afventer';
	is_admin: boolean;
	is_company_user: boolean;
	created_at?: string;
	updated_at?: string;
}

export const getAllStudentsWithStats = async (): Promise<StudentWithStats[]> => {
	// Get all active students (users where is_admin = false and is_company_user = false)
	const { data: activeStudents, error: studentsError } = await supabase
		.from('users')
		.select('*, companies(company_name)')
		.eq('is_admin', false)
		.eq('is_company_user', false);

	if (studentsError) throw studentsError;

	// Get all invited students (pending users)
	const { data: invitedStudents, error: invitedError } = await supabase
		.from('invited_users')
		.select('*, companies(company_name)')
		.eq('is_company_user', false);

	if (invitedError) throw invitedError;

	// Get all course_seats
	const { data: seats, error: seatsError } = await supabase.from('course_seats').select('user_id, course_id');

	if (seatsError) throw seatsError;



	// Map active students
	const activeStudentsWithStats: StudentWithStats[] = activeStudents.map(student => {
		const studentSeats = seats?.filter(seat => seat.user_id === student.user_id) || [];
		const uniqueCourses = new Set(studentSeats.map(seat => seat.course_id)).size;

		return {
			user_id: student.user_id,
			email: student.email,
			first_name: student.first_name,
			last_name: student.last_name,
			company_id: student.company_id,
			company_name: student.companies?.company_name || '',
			courseCount: uniqueCourses,
			status:  'Aktiv',
			is_admin: student.is_admin,
			is_company_user: student.is_company_user,
			created_at: student.created_at,
			updated_at: student.updated_at,
		};
	});

	// Map invited students (pending)
	const invitedStudentsWithStats: StudentWithStats[] = invitedStudents.map(invitedStudent => {
		return {
			user_id: invitedStudent.invited_user_id,
			email: invitedStudent.user_email,
			first_name: invitedStudent.first_name,
			last_name: invitedStudent.last_name,
			company_id: invitedStudent.company_id,
			company_name: invitedStudent.companies?.company_name || '',
			courseCount: 0,
			status: 'Afventer',
			is_admin: false,
			is_company_user: false,
		};
	});

	// Combine both lists
	const allStudents = [...activeStudentsWithStats, ...invitedStudentsWithStats];

	return allStudents;
};

export const deleteStudentById = async (userId: string): Promise<void> => {
	const { error } = await supabase.from('users').delete().eq('user_id', userId);

	if (error) throw error;
};
