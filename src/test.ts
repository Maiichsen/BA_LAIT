import {getAllCourses} from './services/courseService.ts';

console.log('hey');

(async () => {
  /*createCourse({
    title: 'How to deal with cats',
    short_course_description: 'This is my short description',
    long_course_description: 'This is my long description!!'
  }).then(data => {
    // Here is no type correction. I can write data.yo and it doesn't give an error or warning
    console.log(data);
  }).catch(err => {
    console.log(err);
  });*/
  getAllCourses().then(courses => {
    console.log(`YES! ${courses[0]!.title} courses`);
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
