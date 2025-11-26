import {} from './services/companyService.ts';
import {createEnrollment, getUsersByCompanyAndCourseEnrollment} from './services/courseService.ts';
import {createUser} from './services/userService.ts';

console.log('hey');


/*createCourse({course_description: 'ALL I WANT FOR CHRISTMAAAS IS SOME TIME OFF', cover_image_url: 'image.url hihi', title: 'min super seje kursus title juhuu', estimated_time_minutes: 99999}).then((data) => {
  console.log(data);
}).catch((error) => {
  console.log(error);
});*/


getUsersByCompanyAndCourseEnrollment('29192a2b-1e19-471c-852f-2cb00b405fe0', '40992613-30fb-4518-9d4b-5c510d09035f').then((data) => {
  console.log(data);
}).catch((error) => {
  console.log(error);
});

