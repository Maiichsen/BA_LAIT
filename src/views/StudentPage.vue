<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseModal from '@/components/BaseModal.vue';
import { PencilIcon, TrashIcon, UserPlusIcon } from '@/assets/icons';
import InfoBadge from '@/components/atoms/InfoBadge.vue';
import ToolTip from '@/components/atoms/ToolTip.vue';

// Modal states
const showAddStudentModal = ref(false);
const showViewCoursesModal = ref(false);
const showAssignCourseModal = ref(false);
const showDeleteModal = ref(false);
const selectedStudentId = ref<number | null>(null);
const selectedStudentName = ref<string>('');
const selectedStudentCompany = ref<string>('');

interface Student {
	id: number;
	firstName: string;
	lastName: string;
	status: 'Aktiv' | 'Afventer';
	email: string;
	company: string;
	courses: number;
}

const isLoading = ref(false);

// dummy data - erstarttet med API call når den er klar
const students = ref<Student[]>([
	{
		id: 1,
		firstName: 'Mai',
		lastName: 'Jockwich',
		status: 'Aktiv',
		email: 'Mai.Jockwich@example.dk',
		company: 'ScanPipe',
		courses: 5,
	},
	{
		id: 2,
		firstName: 'Anders',
		lastName: 'Nielsen',
		status: 'Aktiv',
		email: 'anders.nielsen@example.dk',
		company: 'ScanPipe',
		courses: 4,
	},
	{
		id: 3,
		firstName: 'Emma',
		lastName: 'Christensen',
		status: 'Aktiv',
		email: 'emma.christensen@example.dk',
		company: 'ALFABO',
		courses: 2,
	},
	{
		id: 4,
		firstName: 'Lars',
		lastName: 'Jensen',
		status: 'Afventer',
		email: 'lars.jensen@example.dk',
		company: 'Aller Aqua',
		courses: 1,
	},
	{
		id: 5,
		firstName: 'Maria',
		lastName: 'Petersen',
		status: 'Aktiv',
		email: 'maria.petersen@example.dk',
		company: 'UCL',
		courses: 4,
	},
	{
		id: 6,
		firstName: 'Michael',
		lastName: 'Rasmussen',
		status: 'Aktiv',
		email: 'michael.rasmussen@example.dk',
		company: 'Mette Munk',
		courses: 2,
	},
	{
		id: 7,
		firstName: 'Sofie',
		lastName: 'Hansen',
		status: 'Aktiv',
		email: 'sofie.hansen@example.dk',
		company: 'Interreg-NPA',
		courses: 5,
	},
	{
		id: 8,
		firstName: 'Peter',
		lastName: 'Andersen',
		status: 'Afventer',
		email: 'peter.andersen@example.dk',
		company: 'Rockwool',
		courses: 3,
	},
]);

const tableData = computed(() => {
	return students.value.map(student => [
		student.firstName,
		student.lastName,
		student.status,
		student.email,
		student.company,
		student.courses,
		student.id,
	]);
});

function viewStudentCourses(id: number) {
	selectedStudentId.value = id;
	const student = students.value.find(s => s.id === id);
	if (student) {
		selectedStudentName.value = `${student.firstName} ${student.lastName}`;
		selectedStudentCompany.value = student.company;
		showViewCoursesModal.value = true;
	}
}

function assignCourse(id: number) {
	selectedStudentId.value = id;
	showAssignCourseModal.value = true;
}

function editStudent(id: number) {
	console.log('Edit student:', id);
	// Navigate to edit page or open edit modal
}

function deleteStudent(id: number) {
	const student = students.value.find(s => s.id === id);
	if (student) {
		selectedStudentId.value = id;
		selectedStudentName.value = `${student.firstName} ${student.lastName}`;
		showDeleteModal.value = true;
	}
}

function handleDeleteConfirm() {
	if (selectedStudentId.value) {
		students.value = students.value.filter(s => s.id !== selectedStudentId.value);
		showDeleteModal.value = false;
		selectedStudentId.value = null;
		selectedStudentName.value = '';
	}
}

function addStudent() {
	showAddStudentModal.value = true;
}

function handleAddStudentConfirm() {
	// Handle add student logic
	console.log('Add student confirmed');
	showAddStudentModal.value = false;
}
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
					:is-loading="isLoading"
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
						<BaseButton
							variant="badge-hover"
							icon-name="EyeIcon"
							@click="viewStudentCourses(row[6] as number)">
							{{ value }}
						</BaseButton>
					</template>

					<template #cell-Handlinger="{ value }">
						<div class="flex gap-2 items-center">
							<ToolTip text="Tildel kursus">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="assignCourse(value as number)">
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
									@click="editStudent(value as number)">
									<PencilIcon :width="20" :height="20" fill-class="fill-cornflower-blue-500" />
								</button>
							</ToolTip>
							<ToolTip text="Slet">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="deleteStudent(value as number)">
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
				<p>Her kan du tilføje formularen til at invitere en ny kursist.</p>
				<!-- Tilføj form her (fornavn, efternavn, email, virksomhed) -->
			</div>
		</BaseModal>

		<!-- Se tildelte kurser modal -->
		<BaseModal
			v-model="showViewCoursesModal"
			:title="`Tildelte kurser`"
			:show-footer="false">
			<div class="space-y-4">
				<div class="mb-4">
					<p class="text-c2 text-tutara-600">KURSIST:</p>
					<h3 class="text-h5">{{ selectedStudentName }}</h3>
					<h4 class="text-t2">{{ selectedStudentCompany }}</h4>
				</div>
				<p>Her vises de kurser kursisten har tildelt.</p>
				<!-- Tilføj kursus liste her -->
			</div>
		</BaseModal>

		<!-- Tildel kursus modal -->
		<BaseModal
			v-model="showAssignCourseModal"
			title="Administrer kurser"
			confirm-text="Gem ændringer">
			<div class="space-y-4">
				<p class="font-semibold">Vælg kurser og antal pladser (3 valgt)</p>
				<!-- Tilføj form til at vælge kurser og antal pladser -->
			</div>
		</BaseModal>

		<!-- Slet kursist modal -->
		<BaseModal
			v-model="showDeleteModal"
			:title="`Slet ${selectedStudentName} permanent?`"
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
