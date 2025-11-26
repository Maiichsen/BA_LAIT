import {createCompany} from './services/companyService.ts';
import {
  createCourse,
  createCourseKey, createEnrollment,
  deleteCourseById, getAllStudentCourses,
  getCourseById,
} from './services/courseService.ts';
import {
  createUser,
  findCompanyByRegistrationKey,
  findCourseKeyById,
} from './services/userService.ts';

console.log('hey');

/*getCourseById('40992613-30fb-4518-9d4b-5c510d09035f').then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
})*/


getAllStudentCourses('a900584d-77ac-4047-a2d7-c6e63cdca22b').then((data) => {
  console.log(data);
}).catch((error) => {
  console.log(error);
});

/*createEnrollment('af3988d8-60f7-47aa-8442-3d56b2c0f08c','a900584d-77ac-4047-a2d7-c6e63cdca22b');*/
