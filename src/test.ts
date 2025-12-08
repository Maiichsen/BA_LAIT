/*import {} from './services/companyService.ts';
import {} from './services/courseService.ts';*/
import {getAllCourses} from './services/courseService.ts';
// import {supabase} from './db/connection.ts';


console.log('hey');

(async () => {
  getAllCourses().then(courses => {
    console.log(`YES! ${courses.length} courses`);
  }).catch(e => {
    console.error('ERROR', e);
  });
})();

/*checkIfUserExists('test@test.dk').then((data) => {
  console.log(data);
}).catch((error) => {
  console.log(error);
});*/

/*const testlogin = async () => {
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
*/
