<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { EyeIcon, ChevronDownIcon, PencilIcon, TrashIcon } from '@/assets/icons';
import InfoBadge from '@/components/atoms/InfoBadge.vue';

interface Participant {
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
const participants = ref<Participant[]>([
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
	return participants.value.map(participant => [
		participant.firstName,
		participant.lastName,
		participant.status,
		participant.email,
		participant.company,
		participant.courses,
		participant.id,
	]);
});

function viewParticipant(id: number) {
	console.log('View participant:', id);
	// Navigate to participant details or open modal
}

function editParticipant(id: number) {
	console.log('Edit participant:', id);
	// Navigate to edit page or open edit modal
}

function deleteParticipant(id: number) {
	console.log('Delete participant:', id);
	// Show confirmation dialog and delete
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
				<h1 class="text-h1">Kursister</h1>
			</div>
			<div class="flex flex-col gap-6 lg:col-start-2 lg:col-span-14 col-span-full">
				<div class="flex justify-between items-center">
					<h2 class="text-xl font-semibold text-tutara-900">Brugeroversigt</h2>
					<BaseButton variant="primary" icon-name="UserPlusIcon" @click="addParticipant">
							Tilføj kursist
					</BaseButton>
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
						<InfoBadge :variant="value === 'Aktiv' ? 'green' : 'gray'">
							{{ value }}
						</InfoBadge>
					</template>

					<template #cell-Kurser="{ value }">
						<div class="flex items-center gap-2 text-tutara-900">
							<span>{{ value }}</span>
							<EyeIcon :width="16" :height="16" fill-class="fill-tutara-500" />
						</div>
					</template>

					<template #cell-Handlinger="{ value }">
						<div class="flex gap-2 items-center">
							<button
								class="flex items-center justify-center w-8 h-8 hover:opacity-70 transition-opacity cursor-pointer"
								@click="viewParticipant(value as number)"
								title="Vis deltager">
								<ChevronDownIcon :width="13" :height="7" fill-class="fill-purple-500" />
							</button>
							<button
								class="flex items-center justify-center w-8 h-8 hover:opacity-70 transition-opacity cursor-pointer"
								@click="editParticipant(value as number)"
								title="Rediger deltager">
								<PencilIcon :width="20" :height="20" fill-class="fill-purple-500" />
							</button>
							<button
								class="flex items-center justify-center w-8 h-8 hover:opacity-70 transition-opacity cursor-pointer"
								@click="deleteParticipant(value as number)"
								title="Slet deltager">
								<TrashIcon :width="20" :height="20" fill-class="fill-info-red" />
							</button>
						</div>
					</template>
				</BaseTable>
			</div>
		</div>
	</div>
</template>
