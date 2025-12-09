import {
  getCoverImgUrlByCourseId,
} from './services/courseService.ts';

console.log('Running test file');
// 20ff15e0-7cd7-432b-bbf5-9f9ebe48e82e has img
// 55b8bf91-82b9-4c75-980a-29d14cc89c9d no img
(async () => {
  await getCoverImgUrlByCourseId('20ff15e0-7cd7-432b-bbf5-9f9ebe48e82e').then(imgUrl => {
    console.log('yess');
    console.log(imgUrl);
  }).catch(err => {
    console.log('noo');
    console.log(err);
  });
  /*createCourse({
    title: 'Wow cool types 123!',
    short_course_description: 'This is my short description',
    long_course_description: 'This is my long description!!',
  }).then(data => {
    console.log('yes');
    console.log(data);
  }).catch(err => {
    console.log('no');
    console.log(err);
  });*/
  /*getAllCourses().then(courses => {
    console.log(`YES! ${courses[0]!.title} courses`);
  }).catch(e => {
    console.error('ERROR', e);
  });*/
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
