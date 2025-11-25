import {createCompany} from './services/companyService.ts';
import {
  createCourse,
  createCourseKey,
  deleteCourseById,
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


createUser({email: 'MAIL', registration_key: '71bcd413-ea31-48e0-a206-116863147ed2', password:'password'}).then((data) => {
  console.log("noget urelatererte");
  console.log(data);
}).catch((error) => {
  console.log(error);
});
