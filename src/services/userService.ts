import {supabase} from '../db/connection.ts';

/*EMAIL STUFF*/
/*EMAIL STUFF*/
/*EMAIL STUFF*/
export const supabaseSendStudentLoginMail = async (email: string) => {
  try {
    const {error} = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: '/login',
      },
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.log(err);
  }
};

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

    return await supabaseSendStudentLoginMail(data[0].user_email);
  } catch (err) {
    console.log(err);
  }
};

/*CREATING AUTH USERS*/
/*CREATING AUTH USERS*/
/*CREATING AUTH USERS*/
export const checkIfUserExists = async (email: string) => {
  try {
    const {data, error} = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email.toLowerCase());

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const supabaseSignUpNewUser = async (email: string, password: string) => {
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

export const getInvitedUser = async (email: string) => {
  try {
    const {data, error} = await supabase
      .from('invited_users')
      .select()
      .eq('user_email', email.toLowerCase());

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteInvitedUser = async (email: string) => {
  try {
    const {data, error} = await supabase
      .from('invited_users')
      .delete()
      .eq('user_email', email.toLowerCase());

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createAuthStudent = async (email: string, password: string) => {
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
};


/*LOGIN USER*/
/*LOGIN USER*/
/*LOGIN USER*/
