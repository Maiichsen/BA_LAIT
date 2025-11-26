import {getAllCompanies} from './services/companyService.ts';

console.log('hey');

/*
getAllEnrolledCoursesByCompany('29192a2b-1e19-471c-852f-2cb00b405fe0').then((data) => {
  console.log(data);
}).catch((error) => {
  console.log(error);
});
*/


getAllCompanies().then((data) => {
  console.log(data);
}).catch((error) => {
  console.log(error);
});

