import {} from './services/companyService.ts';
import {} from './services/courseService.ts';
import {supabase} from './db/connection.ts';


console.log('hey');


/*getUsersByCompanyAndCourseEnrollment('29192a2b-1e19-471c-852f-2cb00b405fe0', '40992613-30fb-4518-9d4b-5c510d09035f').then((data) => {
  console.log(data);
}).catch((error) => {
  console.log(error);
});*/

const testlogin = async () => {
  try {
    const {data, error} = await supabase.auth.signInWithOtp({
      email: 'megaoreomuffin@hotmail.com',
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

testlogin();
