<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStudentsStore } from '@/stores/studentsStore.ts';
import { useCompaniesStore } from '@/stores/companiesStore.ts';
import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import UserCourseInformationModal from '@/components/user/UserCourseInformationModal.vue';
import AssignUserCourseModal from '@/components/user/AssignUserCourseModal.vue';
import { PencilIcon, TrashIcon, UserPlusIcon } from '@/assets/icons';
import InfoBadge from '@/components/atoms/InfoBadge.vue';
import ToolTip from '@/components/atoms/ToolTip.vue';

const studentsStore = useStudentsStore();
const companiesStore = useCompaniesStore();

// Modal states
const showAddStudentModal = ref(false);
const showViewCoursesModal = ref(false);
const showAssignCourseModal = ref(false);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const selectedStudentId = ref<string | null>(null);
const selectedStudentName = ref<string>('');
const selectedStudentCompany = ref<string>('');
const selectedStudentCompanyId = ref<string | null>(null);

// Add student form
const newStudentEmail = ref('');
const newStudentFirstName = ref('');
const newStudentLastName = ref('');
const newStudentCompanyId = ref('');
const formError = ref('');

// Edit student form
const editStudentFirstName = ref('');
const editStudentLastName = ref('');

onMounted(() => {
	studentsStore.loadStudents();
	companiesStore.loadCompanies();
});

// Refetch students data when modals close
watch(showViewCoursesModal, (isOpen, wasOpen) => {
	if (wasOpen && !isOpen) {
		studentsStore.loadStudents();
	}
});

watch(showAssignCourseModal, (isOpen, wasOpen) => {
	if (wasOpen && !isOpen) {
		studentsStore.loadStudents();
	}
});

const tableData = computed(() => {
	return studentsStore.listOfStudents.map(student => [
		student.first_name || '',
		student.last_name || '',
		student.status,
		student.email,
		student.company_name,
		student.courseCount,
		student.user_id,
	]);
});
console.log(tableData.value);

const companyOptions = computed(() => {
	return companiesStore.listOfCompanies.map(company => ({
		value: company.company_id,
		label: company.company_name,
	}));
});

function viewStudentCourses(id: string) {
	selectedStudentId.value = id;
	const student = studentsStore.listOfStudents.find(s => s.user_id === id);
	if (student) {
		selectedStudentName.value = `${student.first_name || ''} ${student.last_name || ''}`;
		selectedStudentCompany.value = student.company_name;
		showViewCoursesModal.value = true;
	}
}

function assignCourse(id: string) {
	selectedStudentId.value = id;
	const student = studentsStore.listOfStudents.find(s => s.user_id === id);
	if (student) {
		selectedStudentCompanyId.value = student.company_id;
		showAssignCourseModal.value = true;
	}
}

function editStudent(id: string) {
	const student = studentsStore.listOfStudents.find(s => s.user_id === id);
	if (student) {
		selectedStudentId.value = id;
		editStudentFirstName.value = student.first_name || '';
		editStudentLastName.value = student.last_name || '';
		showEditModal.value = true;
	}
}

function handleEditStudentConfirm() {
	if (!selectedStudentId.value || !editStudentFirstName.value.trim() || !editStudentLastName.value.trim()) {
		return;
	}

	studentsStore
		.updateStudentName(selectedStudentId.value, editStudentFirstName.value.trim(), editStudentLastName.value.trim())
		.then(() => {
			showEditModal.value = false;
			selectedStudentId.value = null;
			editStudentFirstName.value = '';
			editStudentLastName.value = '';
		})
		.catch(err => {
			console.error('Fejl ved opdatering af kursist:', err);
		});
}

function deleteStudent(id: string) {
	const student = studentsStore.listOfStudents.find(s => s.user_id === id);
	if (student) {
		selectedStudentId.value = id;
		selectedStudentName.value = `${student.first_name || ''} ${student.last_name || ''}`;
		showDeleteModal.value = true;
	}
}

function handleDeleteConfirm() {
	if (selectedStudentId.value) {
		studentsStore.deleteStudent(selectedStudentId.value);
		showDeleteModal.value = false;
		selectedStudentId.value = null;
		selectedStudentName.value = '';
	}
}

function addStudent() {
	// Reset form
	newStudentEmail.value = '';
	newStudentFirstName.value = '';
	newStudentLastName.value = '';
	newStudentCompanyId.value = '';
	formError.value = '';
	showAddStudentModal.value = true;
}

function handleAddStudentConfirm() {
	// Validate form
	if (!newStudentEmail.value || !newStudentCompanyId.value) {
		formError.value = 'Email og virksomhed er påkrævet';
		return;
	}

	// Email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(newStudentEmail.value)) {
		formError.value = 'Indtast en gyldig email adresse';
		return;
	}

	// Invite student
	studentsStore
		.inviteStudent({
			email: newStudentEmail.value,
			companyId: newStudentCompanyId.value,
			firstName: newStudentFirstName.value || undefined,
			lastName: newStudentLastName.value || undefined,
		})
		.then(() => {
			showAddStudentModal.value = false;
			formError.value = '';
		})
		.catch(err => {
			console.error(err);
			formError.value = 'Der opstod en fejl. Prøv venligst igen.';
		});
}

console.log('HUh', tableData);
</script>

<template>
	<div class="container">
		<div class="container-row">
			<div class="lg:col-start-2 lg:col-span-11 col-span-full mb-8">
				<h1 class="text-h1">Kursister</h1>
			</div>
			<div class="flex flex-col gap-6 lg:col-start-2 lg:col-span-14 col-span-full">
				<div class="flex justify-between items-center">
					<h2 class="text-h6 text-tutara-900">Brugeroversigt</h2>
					<BaseButton variant="primary" icon-name="UserPlusIcon" @click="addStudent"> Tilføj kursist </BaseButton>
				</div>

				<BaseTable
					:is-loading="studentsStore.isLoading"
					:page-size="10"
					has-search
					search-placeholder="Søg efter fornavn, efternavn, email..."
					default-sort="Fornavn"
					:cols="['Fornavn', 'Efternavn', 'Status', 'Email', 'Virksomhed', 'Kurser', 'Handlinger']"
					:rows="tableData">
					<template #cell-Status="{ value }">
						<InfoBadge :variant="value === 'Aktiv' ? 'green' : 'tutara'">
							{{ value }}
						</InfoBadge>
					</template>

					<template #cell-Kurser="{ value, row }">
						<BaseButton variant="badge-hover" icon-name="EyeIcon" @click="viewStudentCourses(row[6] as string)">
							{{ value }}
						</BaseButton>
					</template>

					<template #cell-Handlinger="{ value }">
						<div class="flex gap-2 items-center">
							<ToolTip text="Tildel kursus">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="assignCourse(value as string)">
									<UserPlusIcon
										:width="20"
										:height="25"
										fill-class="fill-purple-500"
										stroke-class="stroke-purple-500" />
								</button>
							</ToolTip>
							<ToolTip text="Rediger">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="editStudent(value as string)">
									<PencilIcon :width="20" :height="20" fill-class="fill-cornflower-blue-500" />
								</button>
							</ToolTip>
							<ToolTip text="Slet">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="deleteStudent(value as string)">
									<TrashIcon :width="20" :height="20" fill-class="fill-info-red" />
								</button>
							</ToolTip>
						</div>
					</template>
				</BaseTable>
			</div>
		</div>

		<!-- Modals -->
		<!-- Inviter ny kursist modal -->
		<BaseModal
			v-model="showAddStudentModal"
			title="Inviter ny kursist"
			confirm-text="Send invitation"
			@confirm="handleAddStudentConfirm">
			<div class="space-y-4">
				<p class="text-t2 text-tutara-700 mb-4">
					Udfyld formularen for at invitere en ny kursist. Kursisten vil modtage en email med et login link.
				</p>

				<!-- Error message -->
				<div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
					{{ formError }}
				</div>

				<div class="flex gap-6">
					<!-- First Name (required) -->
					<BaseInput
						v-model="newStudentFirstName"
						input-type="text"
						input-id="student-firstname"
						label-text="Fornavn *"
						placeholder="Fornavn"
						layout="stacked" />

					<!-- Last Name (required) -->
					<BaseInput
						v-model="newStudentLastName"
						input-type="text"
						input-id="student-lastname"
						label-text="Efternavn *"
						placeholder="Efternavn"
						layout="stacked" />
				</div>

				<!-- Email (required) -->
				<BaseInput
					v-model="newStudentEmail"
					input-type="email"
					input-id="student-email"
					label-text="Email *"
					placeholder="kursist@example.dk"
					layout="stacked" />

				<!-- Company Select (required) -->
				<BaseSelect
					v-model="newStudentCompanyId"
					input-id="student-company"
					label-text="Virksomhed *"
					placeholder="Vælg virksomhed"
					:options="companyOptions"
					layout="stacked" />

				<p class="text-sm text-tutara-500 mt-2">* Påkrævet felt</p>
			</div>
		</BaseModal>

		<!-- Se tildelte kurser modal -->
		<UserCourseInformationModal
			:is-open="showViewCoursesModal"
			:user-id="selectedStudentId"
			@update:is-open="showViewCoursesModal = $event" />

		<!-- Tildel kursus modal -->
		<AssignUserCourseModal
			:is-open="showAssignCourseModal"
			:user-id="selectedStudentId"
			:company-id="selectedStudentCompanyId"
			@update:is-open="showAssignCourseModal = $event"
			@course-assigned="studentsStore.loadStudents()" />

		<!-- Slet kursist modal -->
		<BaseModal v-model="showDeleteModal" :title="`Slet ${selectedStudentName} permanent?`" :show-footer="false">
			<div class="space-y-6">
				<p class="text-tutara-900">Er du sikker på du vil slette?</p>
				<div class="flex justify-center gap-4">
					<BaseButton variant="primary" @click="showDeleteModal = false"> Annuller </BaseButton>
					<BaseButton variant="warning" @click="handleDeleteConfirm"> Slet adgang </BaseButton>
				</div>
			</div>
		</BaseModal>

		<!-- Rediger kursist modal -->
		<BaseModal
			v-model="showEditModal"
			title="Rediger kursist"
			confirm-text="Gem ændringer"
			@confirm="handleEditStudentConfirm">
			<div class="space-y-4">
				<BaseInput
					v-model="editStudentFirstName"
					input-type="text"
					input-id="edit-student-firstname"
					label-text="Fornavn"
					placeholder="Fornavn"
					layout="stacked" />
				<BaseInput
					v-model="editStudentLastName"
					input-type="text"
					input-id="edit-student-lastname"
					label-text="Efternavn"
					placeholder="Efternavn"
					layout="stacked" />
			</div>
		</BaseModal>
	</div>
</template>
