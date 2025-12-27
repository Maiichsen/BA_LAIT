import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
	createInvitedStudent,
	deleteStudentById,
	getAllStudentsWithStats,
	type InviteStudentParams,
	type StudentWithStats,
} from '@/services/studentService.ts';

export const useStudentsStore = defineStore('students', () => {
	const listOfStudents = ref<StudentWithStats[]>([]);

	const isLoading = ref(false);

	const loadStudents = () => {
		isLoading.value = true;
		listOfStudents.value = [];

		getAllStudentsWithStats()
			.then(students => (listOfStudents.value = students))
			.catch(err => console.log(err))
			.finally(() => (isLoading.value = false));
	};

	const deleteStudent = (userId: string) => {
		isLoading.value = true;

		deleteStudentById(userId)
			.then(() => {
				listOfStudents.value = listOfStudents.value.filter(student => student.user_id !== userId);
			})
			.catch(err => console.log(err))
			.finally(() => (isLoading.value = false));
	};

	const inviteStudent = (params: InviteStudentParams) =>
		new Promise(async (resolve, reject) => {
			createInvitedStudent(params)
				.then(() => {
					// Reload students to get the new invited student
					loadStudents();
					resolve(true);
				})
				.catch(err => reject(err));
		});

	return {
		isLoading,
		listOfStudents,
		loadStudents,
		deleteStudent,
		inviteStudent,
	};
});
