<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCompaniesStore } from '@/stores/companiesStore.ts';
import type { Company } from '@/types/db.ts';

const companiesStore = useCompaniesStore();

onMounted(() => {
	companiesStore.loadCompanies();
});

const newCompanyFormIsOpen = ref(false);
const newCompanyName = ref('');
const newCompanyEmail = ref('');

const openNewCompanyForm = () => {
	newCompanyName.value = '';
	newCompanyEmail.value = '';
	newCompanyFormIsOpen.value = true;
};

const closeNewCompanyForm = () => {
	newCompanyFormIsOpen.value = false;
};

const inviteNewCompanyIsLoading = ref(false);

const inviteCompany = () => {
	if (!newCompanyName.value || !newCompanyEmail.value) {
		// TODO: Handle empty fields with error messages
		console.log('Form has empty fields');
		return;
	}

	inviteNewCompanyIsLoading.value = true;

	companiesStore
		.inviteNewCompany(newCompanyName.value, newCompanyEmail.value)
		.then(() => closeNewCompanyForm())
		.catch(err => console.log(err))
		.finally(() => (inviteNewCompanyIsLoading.value = false));
};

const tryDeleteCompany = (company: Company) => {
	if (confirm(`Are you sure you want to delete company: ${company.company_name}`)) {
		companiesStore.deleteCompany(company.company_id);
	}
};
</script>

<template>
	<h1>ADMINISTRER VIRKSOMHEDER</h1>
	<div v-if="companiesStore.isLoading">LOADING</div>
	<button @click="openNewCompanyForm()">Add new company</button>
	<div v-if="newCompanyFormIsOpen" class="border">
		<button @click="closeNewCompanyForm()">close</button>
		<h1>New company form</h1>
		<label for="newCompanyNameField">Company name</label>
		<input id="newCompanyNameField" type="text" v-model="newCompanyName" placeholder="Name" />
		<label for="newCompanyEmailField">Company e-mail</label>
		<input id="newCompanyEmailField" type="text" v-model="newCompanyEmail" placeholder="E-mail" />
		<br />
		<button @click="inviteCompany" :disabled="inviteNewCompanyIsLoading">Invite</button>
	</div>
	<hr />
	<ul>
		<li v-for="company in companiesStore.listOfCompanies" :key="company.company_id">
			{{ company.company_name }}<span @click="tryDeleteCompany(company)">x</span>
		</li>
	</ul>
</template>

<style scoped></style>
