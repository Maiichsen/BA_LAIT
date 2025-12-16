<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useCompaniesStore } from '@/stores/companiesStore.ts';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseTable from '@/components/BaseTable.vue';
import ToolTip from '@/components/atoms/ToolTip.vue';
import { EyeIcon, PencilIcon, TrashIcon } from '@/assets/icons';

const companiesStore = useCompaniesStore();

onMounted(() => {
	companiesStore.loadCompanies();
});

// Define table columns
const tableColumns = ['Virksomhed', 'Oprettelsesdato', 'Kurser', 'Antal kursister', 'Handlinger'] as const;

// Transform companies data to table format
const tableRows = computed(() => {
	return companiesStore.listOfCompanies.map(company => [
		company.company_name,
		new Date(company.created_at).toLocaleDateString('da-DK'),
		company.courseCount,
		company.studentCount,
		company.company_id,
	]);
});

function viewCompany(id: string) {
	console.log('View company:', id);
	// Navigate to company details or open modal
}

function editCompany(id: string) {
	console.log('Edit company:', id);
	// Navigate to edit page or open edit modal
}

function deleteCompany(id: string) {
	const company = companiesStore.listOfCompanies.find(c => c.company_id === id);
	if (company && confirm(`Er du sikker på, at du vil slette virksomheden: ${company.company_name}?`)) {
		companiesStore.deleteCompany(id);
	}
}

function addParticipant() {
	console.log('Add new participant');
	// Navigate to create page or open create modal
}
</script>

<template>
	<div class="container">
		<div class="container-row">
			<div class="lg:col-start-2 lg:col-span-11 col-span-full mb-8">
				<h1 class="text-h1">Virksomheder</h1>
			</div>
			<div class="flex flex-col gap-6 lg:col-start-2 lg:col-span-14 col-span-full">
				<div class="flex justify-between items-center">
					<h2 class="text-h6 text-tutara-900">Brugeroversigt</h2>
					<BaseButton variant="primary" icon-name="UserPlusIcon" @click="addParticipant">
						Tilføj Virksomhed
					</BaseButton>
				</div>
				<BaseTable
					:cols="tableColumns"
					:rows="tableRows"
					:is-loading="companiesStore.isLoading"
					:has-search="true"
					search-placeholder="Søg virksomheder..."
					:page-size="10">
					<template #cell-Handlinger="{ value }">
						<div class="flex gap-2 items-center">
							<ToolTip text="Se detaljer">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="viewCompany(value as string)">
									<EyeIcon :width="20" :height="17" fill-class="fill-tutara-900" />
								</button>
							</ToolTip>
							<ToolTip text="Rediger">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="editCompany(value as string)">
									<PencilIcon :width="20" :height="20" fill-class="fill-cornflower-blue-500" />
								</button>
							</ToolTip>
							<ToolTip text="Slet">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="deleteCompany(value as string)">
									<TrashIcon :width="20" :height="20" fill-class="fill-info-red" />
								</button>
							</ToolTip>
						</div>
					</template>
				</BaseTable>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
