import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
	createInvitedCompany,
	deleteCompanyById,
	getAllCompaniesWithStats,
	type CompanyWithStats,
} from '@/services/companyService.ts';

export const useCompaniesStore = defineStore('companies', () => {
	const listOfCompanies = ref<CompanyWithStats[]>([]);

	const isLoading = ref(false);

	const loadCompanies = () => {
		isLoading.value = true;
		listOfCompanies.value = [];

		getAllCompaniesWithStats()
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
					// Add stats to the new company (starts with 0 courses and students)
					const companyWithStats: CompanyWithStats = {
						...company,
						courseCount: 0,
						studentCount: 0,
					};
					listOfCompanies.value.push(companyWithStats);
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
