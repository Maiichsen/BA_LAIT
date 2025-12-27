<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { useCompaniesStore } from '@/stores/companiesStore.ts';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseTable from '@/components/BaseTable.vue';
import BaseModal from '@/components/BaseModal.vue';
import CompanyCourseInformationModal from '@/components/company/CompanyCourseInformationModal.vue';
import ToolTip from '@/components/atoms/ToolTip.vue';
import { EditIcon, PencilIcon, TrashIcon } from '@/assets/icons';


const companiesStore = useCompaniesStore();

// Modal states
const showAddCompanyModal = ref(false);
const showViewCoursesModal = ref(false);
const showManageCoursesModal = ref(false);
const showDeleteModal = ref(false);
const selectedCompanyId = ref<string | null>(null);
const selectedCompanyName = ref<string>('');

onMounted(() => {
	companiesStore.loadCompanies();
});

// Refetch companies data when course information modal closes
watch(showViewCoursesModal, (isOpen, wasOpen) => {
	if (wasOpen && !isOpen) {
		companiesStore.loadCompanies();
	}
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
	selectedCompanyId.value = id;
	showViewCoursesModal.value = true;
}

function manageCompanyCourses(id: string) {
	selectedCompanyId.value = id;
	showManageCoursesModal.value = true;
}

function editCompany(id: string) {
	console.log('Edit company:', id);
	// Navigate to edit page or open edit modal
}

function deleteCompany(id: string) {
	const company = companiesStore.listOfCompanies.find(c => c.company_id === id);
	if (company) {
		selectedCompanyId.value = id;
		selectedCompanyName.value = company.company_name;
		showDeleteModal.value = true;
	}
}

function handleDeleteConfirm() {
	if (selectedCompanyId.value) {
		companiesStore.deleteCompany(selectedCompanyId.value);
		showDeleteModal.value = false;
		selectedCompanyId.value = null;
		selectedCompanyName.value = '';
	}
}

function addCompany() {
	showAddCompanyModal.value = true;
}

function handleAddCompanyConfirm() {
	// Handle add company logic
	console.log('Add company confirmed');
	showAddCompanyModal.value = false;
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
					<BaseButton variant="primary" icon-name="UserPlusIcon" @click="addCompany"> Tilføj Virksomhed </BaseButton>
				</div>

				<BaseTable
					:cols="tableColumns"
					:rows="tableRows"
					:is-loading="companiesStore.isLoading"
					:has-search="true"
					search-placeholder="Søg virksomheder..."
					:page-size="10">

						<template #cell-Kurser="{ value, row }">
						<BaseButton
							variant="badge-hover"
							icon-name="EyeIcon"
							@click="viewCompany(row[4] as string)">
							{{ value }}
						</BaseButton>
					</template>

					<template #cell-Handlinger="{ value }">
						<div class="flex gap-2 items-center">
							<ToolTip text="Administrer kurser">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="manageCompanyCourses(value as string)">
									<EditIcon :width="25" :height="20" stroke-class="stroke-purple-500" />
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

		<!-- Modals -->
		<!-- Tilføj virksomhed modal -->
		<BaseModal
			v-model="showAddCompanyModal"
			title="Opret ny virksomhed"
			@confirm="handleAddCompanyConfirm">
			<div class="space-y-4">
				<p>Her kan du tilføje indhold for at oprette en ny virksomhed.</p>
				<!-- Tilføj din form her -->
			</div>
		</BaseModal>

		<!-- Se tildelte kurser modal -->
		<CompanyCourseInformationModal v-model:is-open="showViewCoursesModal" :company-id="selectedCompanyId" />

		<!-- Administrer kurser modal -->
		<BaseModal
			v-model="showManageCoursesModal"
			title="Administrer kurser"
			confirm-text="Gem ændringer">
			<div class="space-y-4">
				<p>Her kan du administrere kurser for virksomheden.</p>
				<!-- Tilføj form til at vælge kurser og antal pladser -->
			</div>
		</BaseModal>

		<!-- Slet virksomhed modal -->
		<BaseModal
			v-model="showDeleteModal"
			:title="`Slet ${selectedCompanyName} permanent?`"
			:show-footer="false">
			<div class="space-y-6">
				<p class="text-tutara-900">Er du sikker på du vil slette?</p>
				<div class="flex justify-center gap-4">
					<BaseButton variant="primary" @click="showDeleteModal = false">
						Annuller
					</BaseButton>
					<BaseButton variant="warning" @click="handleDeleteConfirm">
						Slet adgang
					</BaseButton>
				</div>
			</div>
		</BaseModal>
	</div>
</template>

<style scoped></style>
