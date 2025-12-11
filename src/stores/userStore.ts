import { defineStore } from 'pinia';
import {ref} from 'vue';

export const useUserStore = defineStore('user', () => {
	const isUserAdmin = ref(false);
	const isUserCompany = ref(false);

	return {
		isUserAdmin,
		isUserCompany,
	};
});
