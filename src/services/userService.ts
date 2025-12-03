import {supabase} from '../db/connection.ts';

/*EMAIL STUFF*/
/*EMAIL STUFF*/
/*EMAIL STUFF*/
const supabaseSendStudentLoginMail = async (email: string) => {
  try {
    const {error} = await supabase.auth.signInWithOtp({
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
const checkIfUserExists = async (email: string) => {
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

const supabaseSignUpNewUser = async (email: string, password: string) => {
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

const getInvitedUser = async (email: string) => {
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

const deleteInvitedUser = async (email: string) => {
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


/*LOGIN USER*/
/*LOGIN USER*/
/*LOGIN USER*/
export const signInUser = async (email: string, password: string) => {
  try {
    const {data, error} = await supabase.auth.signInWithPassword({
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
    const {data, error} = await supabase.auth.getUser();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

/*UPDATE USER*/
/*UPDATE USER*/
/*UPDATE USER*/
const updateAuthUserPassword = async (password: string) => {
  try {
    const {data, error} = await supabase.auth.updateUser({
      password: password,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

const updateFirstnameAndLastName = async (firstname: string, lastname: string) => {
  try {
    const userData = await getAuthUser();
    if (!userData) throw new Error('no user data');
    if (!userData.user) throw new Error('no user');

    const {data, error} = await supabase
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

export const updateNewUser = async (password: string, firstname: string, lastname: string) => {
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
