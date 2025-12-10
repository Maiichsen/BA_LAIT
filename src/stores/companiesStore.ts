import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Company } from '@/types/db.ts';
import { createInvitedCompany, deleteCompanyById, getAllCompanies } from '@/services/companyService.ts';

export const useCompaniesStore = defineStore('companies', () => {
	const listOfCompanies = ref<Company[]>([]);

	const isLoading = ref(false);

	const loadCompanies = () => {
		isLoading.value = true;
		listOfCompanies.value = [];

		getAllCompanies()
			.then(companies => (listOfCompanies.value = companies))
			.catch(err => console.log(err))
			.finally(() => (isLoading.value = false));
	};

	const deleteCompany = (companyId: string) => {
		isLoading.value = true;

		deleteCompanyById(companyId)
			.then(() => {
				listOfCompanies.value = listOfCompanies.value.filter(company => company.company_id !== companyId);
			})
			.catch(err => console.log(err))
			.finally(() => (isLoading.value = false));
	};

	const inviteNewCompany = (companyName: string, companyEmail: string) =>
		new Promise(async (resolve, reject) => {
			createInvitedCompany(companyName, companyEmail)
				.then(company => {
					listOfCompanies.value.push(company);
					resolve(company);
				})
				.catch(err => reject(err));
		});

	return {
		isLoading,
		listOfCompanies,
		loadCompanies,
		deleteCompany,
		inviteNewCompany,
	};
});
