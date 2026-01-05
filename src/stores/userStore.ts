import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
	getAuthUser,
	getUserRoleById,
	signInUser,
	signOutAuthUser,
} from '@/services/userService.ts';

export const useUserStore = defineStore('user', () => {
	const isUserAdmin = ref(false);
	const isUserCompany = ref(false);
	const isInitialized = ref(false);
	const userId = ref<null | string>(null);

	const verifyUserRole = async () =>
		new Promise<void>(async (resolve, reject) => {
			isUserAdmin.value = false;
			isUserCompany.value = false;

			await getAuthUser()
				.then(async user => {
					userId.value = user.id;

					await getUserRoleById(user.id)
						.then(role => {
							if (role.is_admin) {
								isUserAdmin.value = true;
							}
							if (role.is_company_user) {
								isUserCompany.value = true;
							}
							isInitialized.value = true;
							resolve();
						})
						.catch(error => {
							reject(error);
						});
				})
				.catch(error => {
					reject(error);
				});
		});

	const login = (userPassword: string, userEmail: string): Promise<void> =>
		new Promise((resolve, reject) => {
			signInUser(userEmail, userPassword)
				.then(async () => {
					await verifyUserRole();
					resolve();
				})
				.catch(error => {
					reject(error);
				});
		});

	const logout = (): Promise<void> => new Promise((resolve, reject) => {
		signOutAuthUser().then(() => {
			// Reset information about user
			isUserAdmin.value = false;
			isUserCompany.value = false;
			isInitialized.value = false;
			userId.value = null;

			resolve();
		}).catch(error => {
			reject(error);
		});
	});

	return {
		isUserAdmin,
		isUserCompany,
		isInitialized,
		userId,
		verifyUserRole,
		login,
		logout,
	};
});
