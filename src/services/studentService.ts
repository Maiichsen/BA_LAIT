import {supabase} from '@/db/connection.ts';
import {
  checkIfUserExists,
  deleteInvitedUser,
  getAuthUser,
  getInvitedUser, supabaseSendLoginMail, supabaseSignUpNewUser,
  updateAuthUserPassword, updateFirstnameAndLastName,
} from '@/services/userService.ts';

export const createInvitedStudent = async (email: string, companyId: string) => {
  console.log(email);
  console.log(companyId);
  try {
    const {data, error} = await supabase
      .from('invited_users')
      .insert({
        company_id: companyId,
        user_email: email,
      })
      .select();

    if (error) throw error;
    if (!data) throw new Error('No data object found, lost in space');

    return await supabaseSendLoginMail(data[0].user_email);
  } catch (err) {
    console.log(err);
  }
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

export const createStudent = async (userId: string, email: string) => {
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
};

export const updateNewStudent = async (password: string, firstname: string, lastname: string) => {
  try {

    const authUser = await getAuthUser();
    if (!authUser) throw new Error('no user data');
    if (!authUser.user || !authUser.user.email) throw new Error('no user found');

    await createStudent(authUser.user.id, authUser.user.email);

    await Promise.all([
      updateAuthUserPassword(password),
      updateFirstnameAndLastName(firstname, lastname),
    ]);

    return true;
  } catch (err) {
    console.log(err);
  }
};
